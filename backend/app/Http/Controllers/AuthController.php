<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ Register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'phone' => 'required|max:15',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'visible_password' => $request->password,
            'role_id' => 3,
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // ✅ Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 🚨 Check if user is inactive (assuming 1 = active, 0 = inactive)
        if ($user->status != 'Active') {
            return response()->json(['message' => 'Your account is not active. Please contact support.'], 403);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // ✅ Get Profile
    public function profile(Request $request)
    {
        $admin = $request->user();

        return response()->json([
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $admin = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
            'phone' => 'nullable|string|max:20',
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:6',
        ]);

        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->phone = $request->phone;

        // Change password if provided
        if ($request->currentPassword && $request->newPassword) {
            if (!Hash::check($request->currentPassword, $admin->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 400);
            }

            $admin->password = Hash::make($request->newPassword);
            $admin->visible_password = $request->newPassword; // Save plain password
        }

        $admin->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }

    // ✅ Logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
