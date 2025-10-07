<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\JewellerCustomer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class JewellerCustomerController extends Controller
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

    // ✅ Fetch customers for jeweller
    $customers = JewellerCustomer::with('staff')
        ->where('jeweller_id', $jewellerId)
        ->latest()
        ->get();

    return $customers;
}

    public function store(Request $request)
    {
        $jewellerId = Auth::id();

        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email', // prevent duplicate emails
            'mobile' => 'required|string|max:20',
            'customer_type' => 'required|in:regular,vip,walk-in,online',
            'assigned_staff_id' => 'nullable|exists:users,id',
            'kyc_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Generate password
        $plainPassword = Str::random(10);

        // Create user account for this customer
        $user = User::create([
            'name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->mobile,
            'role_id' => Role::where('name', 'Customers')->first()->id,
            'password' => Hash::make($plainPassword),
            'visible_password' => $plainPassword,
        ]);

        // Prepare customer data
        $data = $request->only([
            'full_name',
            'email',
            'mobile',
            'dob',
            'anniversary',
            'customer_type',
            'aadhar_number',
            'permanent_address',
            'residence_address',
            'assigned_staff_id'
        ]);
        $data['jeweller_id'] = $jewellerId;
        $data['user_id'] = $user->id; // link customer to user

        // Handle KYC files
        $kycFiles = [];
        if ($request->hasFile('kyc_documents')) {
            foreach ($request->file('kyc_documents') as $file) {
                $kycFiles[] = $file->store('kyc_documents', 'public');
            }
        }
        $data['kyc_documents'] = $kycFiles;

        // Save customer
        $customer = JewellerCustomer::create($data);

        return response()->json([
            'message' => 'Jeweller customer added successfully',
            'customer' => $customer,
            'credentials' => [
                'email' => $user->email,
                'password' => $plainPassword
            ]
        ]);
    }

    public function show($id)
    {
        $jewellerId = Auth::id();

        $customer = JewellerCustomer::with('staff') // staff is User model for assigned_staff_id
            ->where('jeweller_id', $jewellerId)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $jewellerId = Auth::id();

        $customer = JewellerCustomer::where('jeweller_id', $jewellerId)->where('id', $id)->firstOrFail();

        // validation — modify unique rules if you want email unique per jeweller
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'mobile' => 'required|string|max:20',
            'customer_type' => 'required|in:regular,vip,walk-in,online',
            'assigned_staff_id' => 'nullable|exists:users,id',
            'kyc_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:4096',
            'remove_kyc' => 'nullable|array',            // optional list of existing filenames to remove
            'remove_kyc.*' => 'string',
        ]);

        // Update basic fields
        $customer->full_name = $request->full_name;
        $customer->email = $request->email;
        $customer->mobile = $request->mobile;
        $customer->dob = $request->dob ?: null;
        $customer->anniversary = $request->anniversary ?: null;
        $customer->customer_type = $request->customer_type;
        $customer->aadhar_number = $request->aadhar_number ?: null;
        $customer->permanent_address = $request->permanent_address ?: null;
        $customer->residence_address = $request->residence_address ?: null;
        $customer->assigned_staff_id = $request->assigned_staff_id ?: null;

        // Handle KYC files: existing files stored as array in kyc_documents (cast => array)
        $existing = $customer->kyc_documents ?? [];

        // Remove files requested by frontend
        if ($request->filled('remove_kyc')) {
            foreach ($request->input('remove_kyc', []) as $removeFile) {
                // If stored path (eg. 'kyc_documents/abc.jpg') then delete from storage
                if (in_array($removeFile, $existing)) {
                    // delete from storage disk (public)
                    if (Storage::disk('public')->exists($removeFile)) {
                        Storage::disk('public')->delete($removeFile);
                    }
                    // remove from array
                    $existing = array_values(array_diff($existing, [$removeFile]));
                }
            }
        }

        // Add newly uploaded files
        if ($request->hasFile('kyc_documents')) {
            foreach ($request->file('kyc_documents') as $file) {
                $path = $file->store('kyc_documents', 'public');
                $existing[] = $path;
            }
        }

        $customer->kyc_documents = $existing;

        $customer->save();

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer,
        ]);
    }

    public function destroy($id)
    {
        $customer = JewellerCustomer::findOrFail($id);

        // Delete linked user if exists
        if ($customer->user_id) {
            $user = User::find($customer->user_id);
            if ($user) {
                $user->delete();
            }
        }

        // Delete the customer itself
        $customer->delete();

        return response()->json([
            'message' => 'Customer and linked user deleted successfully'
        ]);
    }

    public function resetCredentials($id)
    {
        $customer = JewellerCustomer::with('user')->findOrFail($id);

        if (!$customer->user) {
            return response()->json([
                'message' => 'This customer has no linked user account.'
            ], 404);
        }

        // Generate a new random password
        $newPassword = Str::random(10);

        // Update user with hashed + visible password
        $customer->user->update([
            'password' => Hash::make($newPassword),
            'visible_password' => $newPassword
        ]);

        return response()->json([
            'message' => 'Credentials reset successfully',
            'credentials' => [
                'email' => $customer->user->email,
                'password' => $newPassword
            ]
        ]);
    }



}
