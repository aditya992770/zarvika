<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Jeweller;
use App\Models\User;

class DisableExpiredSubscriptionsAndJeweller extends Command
{
    protected $signature = 'subscriptions:disable-expired';
    protected $description = 'Disable expired subscriptions and deactivate related jeweller users';

    public function handle()
    {
        $expiredSubscriptions = Subscription::where('expiry_date', '<', now())
            ->where('status', '!=', 'inactive')
            ->get();

        $count = 0;

        foreach ($expiredSubscriptions as $subscription) {
            // 1. Mark subscription inactive
            $subscription->status = 'inactive';
            $subscription->save();

            // 2. Find jeweller by jeweller_id
            $jeweller = Jeweller::find($subscription->jeweller_id);

            if ($jeweller) {
                // 3. Find user by user_id from jewellers table
                $user = User::find($jeweller->user_id);

                if ($user) {
                    $user->status = 'inactive';
                    $user->save();
                }
            }

            $count++;
        }

        $this->info("✅ {$count} expired subscriptions and linked users deactivated.");
    }
}
