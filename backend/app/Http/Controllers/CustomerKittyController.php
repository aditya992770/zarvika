<?php

namespace App\Http\Controllers;

use App\Models\CustomerKitty;
use App\Models\Kitty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerKittyController extends Controller
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

    // ✅ Fetch customer kitties for jeweller
    $kitties = CustomerKitty::with('customer')
        ->where('created_by', $jewellerId)
        ->latest()
        ->get();

    return response()->json($kitties);
}


    public function store(Request $request)
    {
        // Validate only customer_id, kitty_id, target_amount, notes, status, dates
        $data = $request->validate([
            'kitty_id' => 'required|exists:kitties,id',
            'customer_id' => 'required|exists:jeweller_customers,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'target_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,completed,paused',
        ]);

        // Fetch kitty_name and kitty_type from kitties table
        $kitty = Kitty::findOrFail($data['kitty_id']);
        $data['kitty_name'] = $kitty->kitty_name;
        $data['kitty_type'] = $kitty->kitty_type;

        $data['created_by'] = Auth::id();

        $customerKitty = CustomerKitty::create($data);

        return response()->json($customerKitty, 201);
    }

    public function show($id)
    {
        // Eager load 'customer' and 'kitty' relationships
        $kitty = CustomerKitty::with(['customer', 'kitty'])->findOrFail($id);

        return response()->json($kitty);
    }

    public function update(Request $request, $id)
    {
        $customerKitty = CustomerKitty::findOrFail($id);

        $data = $request->validate([
            'kitty_id' => 'required|exists:kitties,id',
            'customer_id' => 'required|exists:jeweller_customers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'target_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,completed,paused',
        ]);

        $kitty = Kitty::findOrFail($data['kitty_id']);
        $data['kitty_name'] = $kitty->kitty_name;
        $data['kitty_type'] = $kitty->kitty_type;

        $customerKitty->update($data);

        return response()->json($customerKitty);
    }


    public function destroy($id)
    {
        $kitty = CustomerKitty::findOrFail($id);
        $kitty->delete();

        return response()->json(['message' => 'Kitty deleted successfully']);
    }
}
