<?php

namespace App\Http\Controllers;

use App\Models\Jeweller;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class JewellerController extends Controller
{
    // List jewellers with optional status filter
    public function index(Request $request)
    {
        $query = Jeweller::with('user'); // eager load user data

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->latest()->get();
    }

    // Add new jeweller
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'business_name' => 'required|string',
            'email' => 'required|email|unique:users,email', // must be unique in users table
            'mobile' => 'required|string|unique:users,phone',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        // handle logo upload
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('jewellers', 'public');
        }

        // Auto-generate password only
        $password = Str::random(10);

        // Create user first
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->mobile,
            'password' => Hash::make($password),
            'visible_password' => $password,
            'status' => 'Inactive',
            'role_id' => Role::where('name', 'Jewellers')->first()->id,
        ]);

        // Create jeweller profile
        $jeweller = Jeweller::create([
            'user_id' => $user->id,
            'business_name' => $request->business_name,
            'address' => $request->address,
            'logo' => $logoPath,
            'status' => 'Pending',
        ]);

        return response()->json([
            'jeweller' => $jeweller->load('user'),
            'credentials' => [
                'email' => $user->email,
                'password' => $password, // send only once
            ]
        ], 201);
    }

    // View profile
    public function show($id)
    {
        $jeweller = Jeweller::with('user')->findOrFail($id);

        return response()->json($jeweller);
    }

    // Reset password
    public function resetPassword($id)
    {
        $jeweller = Jeweller::with('user')->findOrFail($id);

        $password = Str::random(10);

        $jeweller->user->update([
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
            'credentials' => [
                'email' => $jeweller->user->email,
                'password' => $password,
            ]
        ]);
    }

    // Dashboard stats
    public function dashboardStats()
{
    $month = Carbon::now()->month;
    $year = Carbon::now()->year;

    $totalJewellers = Jeweller::count();
    $activeJewellers = Jeweller::where('status', 'Active')->count();
    $pendingJewellers = Jeweller::where('status', 'Pending')->count();
    $suspendedJewellers = Jeweller::where('status', 'Suspended')->count();
    $thisMonthJewellers = Jeweller::whereMonth('created_at', $month)
        ->whereYear('created_at', $year)
        ->count();
    $totalSubscriptions = Subscription::count();
    $activeSubscriptions = Subscription::where('status', 'Active')->count();
    $expiredSubscriptions = Subscription::where('status', 'Inactive')->count();

    // Subscriptions growth for the last 6 months
    $subscriptionsGrowth = [];
    for ($i = 5; $i >= 0; $i--) {
        $date = Carbon::now()->subMonths($i);
        $monthName = $date->format('M');
        $count = Subscription::whereMonth('created_at', $date->month)
                             ->whereYear('created_at', $date->year)
                             ->count();
        $subscriptionsGrowth[] = [
            'month' => $monthName,
            'subscriptions' => $count
        ];
    }

    return response()->json([
        'totalJewellers' => $totalJewellers,
        'activeJewellers' => $activeJewellers,
        'pendingJewellers' => $pendingJewellers,
        'suspendedJewellers' => $suspendedJewellers,
        'thisMonthJewellers' => $thisMonthJewellers,
        'totalSubscriptions' => $totalSubscriptions,
        'activeSubscriptions' => $activeSubscriptions,
        'expiredSubscriptions' => $expiredSubscriptions,
        'subscriptionsGrowth' => $subscriptionsGrowth, // <-- new
    ]);
}
    public function resetCredentials($id)
    {
        $jeweller = Jeweller::with('user')->findOrFail($id);

        if (!$jeweller->user) {
            return response()->json([
                'message' => 'This jeweller has no linked user account.'
            ], 404);
        }

        // Generate a new random password
        $newPassword = Str::random(10);

        // Update user with hashed + visible password
        $jeweller->user->update([
            'password' => Hash::make($newPassword),
            'visible_password' => $newPassword
        ]);

        return response()->json([
            'message' => 'Credentials reset successfully',
            'credentials' => [
                'email' => $jeweller->user->email,
                'password' => $newPassword
            ]
        ]);
    }

}
