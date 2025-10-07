<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JewellerStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class JewellerStaffController extends Controller
{

    public function index(Request $request)
{
    $jewellerId = Auth::id();

    // Build query for this jeweller's staff
    $query = JewellerStaff::with('user')
        ->where('jeweller_id', $jewellerId);

    // Apply status filter if provided
    if ($request->has('status') && !empty($request->status)) {
        $query->where('status', $request->status);
    }

    $staff = $query->orderBy('created_at', 'desc')->get()
        ->map(function ($s) {
            return [
                'id' => $s->id,
                'user_id' => $s->user_id,
                'name' => $s->name,
                'email' => $s->user->email ?? null,   // fetch email from users table
                'phone' => $s->user->phone ?? null,   // fetch phone from users table
                'address' => $s->address ?? null,
                'status' => $s->status ?? 'Pending',
                'created_at' => $s->created_at,
            ];
        });

    return response()->json($staff);
}

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string|max:20',
        'address' => 'nullable|string',
    ]);

    $jewellerId = Auth::id(); // Logged-in jeweller
    if (!$jewellerId) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $passwordPlain = Str::random(10);

    // Create user for staff
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        'role_id' => 4, // staff
        'password' => Hash::make($passwordPlain),
        'visible_password' => $passwordPlain,
    ]);

    // Create staff profile
    $staff = JewellerStaff::create([
        'user_id' => $user->id,
        'jeweller_id' => $jewellerId,
        'name' => $request->name,
        'phone' => $request->phone,
        'address' => $request->address,
        'status' => 'Active',
    ]);

    return response()->json([
        'message' => 'Staff created successfully',
        'staff' => $staff,
        'credentials' => [
            'email' => $user->email,
            'password' => $passwordPlain,
        ],
    ], 201);
}


    public function resetCredentials($id)
    {
        $staff = JewellerStaff::with('user')->findOrFail($id);

        if (!$staff->user) {
            return response()->json([
                'message' => 'This jeweller has no linked user account.'
            ], 404);
        }

        // Generate a new random password
        $newPassword = Str::random(10);

        // Update user with hashed + visible password
        $staff->user->update([
            'password' => Hash::make($newPassword),
            'visible_password' => $newPassword
        ]);

        return response()->json([
            'message' => 'Credentials reset successfully',
            'credentials' => [
                'email' => $staff->user->email,
                'password' => $newPassword
            ]
        ]);
    }
    public function dashboardStats()
    {
        $totalStaff = JewellerStaff::count();
        $activeStaff = JewellerStaff::where('status', 'Active')->count();
        $pendingStaff = JewellerStaff::where('status', 'Pending')->count();
        $suspendedStaff = JewellerStaff::where('status', 'Suspended')->count();

        return response()->json([
            'totalStaff' => $totalStaff,
            'activeStaff' => $activeStaff,
            'pendingStaff' => $pendingStaff,
            'suspendedStaff' => $suspendedStaff,
        ]);
    }
}
