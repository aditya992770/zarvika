<?php

namespace App\Http\Controllers;

use App\Models\Kitty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KittyController extends Controller
{
    public function index()
{
    $user = Auth::user();

    // ✅ Case 1: If staff (role_id = 4)
    if ($user->role_id == 4) {
        $jewellerId = \DB::table('jeweller_staff')
            ->where('user_id', $user->id)
            ->value('jeweller_id'); // get jeweller_id for this staff

        if (!$jewellerId) {
            return response()->json(['message' => 'No jeweller found for this staff'], 404);
        }
    } 
    // ✅ Case 2: If jeweller
    else {
        $jewellerId = $user->id;
    }

    // ✅ Fetch kitty for jeweller
    $kitties = Kitty::where('created_by', $jewellerId)
        ->latest()
        ->get();

    return response()->json($kitties);
}


    public function store(Request $request)
    {
        $data = $request->validate([
            'kitty_name'       => 'required|string|max:255',
            'kitty_type'       => 'required|in:gold,silver,custom',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'target_amount'    => 'required|numeric|min:0',
            'collected_amount' => 'nullable|numeric|min:0',
            'status'           => 'required|in:active,completed,paused',
            'description'      => 'nullable|string',
        ]);

        // 🔹 Automatically assign logged-in user
        $data['created_by'] = auth()->id();

        $kitty = Kitty::create($data);

        return response()->json($kitty, 201);
    }

    public function show($id)
    {
        return response()->json(Kitty::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $kitty = Kitty::findOrFail($id);

        $data = $request->validate([
            'kitty_name'       => 'sometimes|required|string|max:255',
            'kitty_type'       => 'sometimes|required|in:gold,silver,custom',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'target_amount'    => 'sometimes|required|numeric|min:0',
            'collected_amount' => 'nullable|numeric|min:0',
            'status'           => 'sometimes|required|in:active,completed,paused',
            'description'      => 'nullable|string',
        ]);

        $kitty->update($data);

        return response()->json($kitty);
    }

    public function destroy($id)
    {
        $kitty = Kitty::findOrFail($id);
        $kitty->delete();

        return response()->json(['message' => 'Kitty deleted successfully']);
    }

    public function pause($id)
    {
        $kitty = Kitty::findOrFail($id);
        $kitty->update(['status' => 'paused']);

        return response()->json(['message' => 'Kitty paused']);
    }

    public function resume($id)
    {
        $kitty = Kitty::findOrFail($id);
        $kitty->update(['status' => 'active']);

        return response()->json(['message' => 'Kitty resumed']);
    }
}
