<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\SubscriptionLog;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        // Fetch subscriptions with jeweller info
        $subscriptions = Subscription::with(['jeweller.user'])->get();
        return response()->json($subscriptions);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,cancelled'
        ]);

        $subscription = Subscription::findOrFail($id);

        // old status (optional, for logging)
        $oldStatus = $subscription->status;

        // update subscription status
        $subscription->status = $request->status;
        $subscription->save();

        // Update linked Jeweller's user status
        $jeweller = $subscription->jeweller; // assumes relationship: Subscription->jeweller
        if ($jeweller && $jeweller->user) {
            $jeweller->user->status = $request->status === 'active' ? 'active' : 'inactive';
            $jeweller->user->save();
        }

        // log the action
        SubscriptionLog::create([
            'subscription_id' => $subscription->id,
            'action' => 'status_update',
            'notes' => "Status changed from {$oldStatus} to {$subscription->status}",
            'start_date' => $subscription->start_date,
            'expiry_date' => $subscription->expiry_date,
            'status' => $subscription->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Subscription status updated to {$subscription->status}"
        ]);
    }



    public function updatePlan(Request $request, $id)
    {
        $subscription = Subscription::findOrFail($id);

        // Save old values for logging
        $oldStartDate = $subscription->start_date;
        $oldExpiryDate = $subscription->expiry_date;
        $oldStatus = $subscription->status;

        // Update subscription
        $subscription->start_date = $request->start_date;
        $subscription->expiry_date = $request->expiry_date;
        $subscription->save();

        // Create a log entry
        SubscriptionLog::create([
            'subscription_id' => $subscription->id,
            'action' => 'update',            // could be 'update', 'renew', etc.
            'notes' => $request->note ?? null,
            'start_date' => $subscription->start_date,
            'expiry_date' => $subscription->expiry_date,
            'status' => $subscription->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan updated and logged'
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'jeweller_id' => 'required|exists:jewellers,id',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date',
            'status' => 'required|in:active,inactive,cancelled'
        ]);

        // 1. Create the subscription
        $subscription = Subscription::create($request->all());

        // 2. Update linked Jeweller's user to active
        $jeweller = $subscription->jeweller;
        if ($jeweller) {
            // Update Jeweller status if inactive
            if (strtolower($jeweller->status) === 'pending') {
                $jeweller->status = 'Active';
                $jeweller->save();
            }

            // Update related user status to active
            if ($jeweller->user) {
                $jeweller->user->status = 'active';
                $jeweller->user->save();
            }
        }

        if ($jeweller && $jeweller->status == 'Inactive') {

        }

        // 3. Log the creation
        SubscriptionLog::create([
            'subscription_id' => $subscription->id,
            'action' => 'create',
            'notes' => 'Subscription created',
            'start_date' => $subscription->start_date,
            'expiry_date' => $subscription->expiry_date,
            'status' => $subscription->status,
        ]);

        return response()->json([
            'success' => true,
            'subscription' => $subscription
        ]);
    }

    public function logs($id)
    {
        $logs = SubscriptionLog::where('subscription_id', $id)->latest()->get();
        return response()->json($logs);
    }



}
