<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionLog extends Model
{
    use HasFactory;

    protected $table = 'subscription_logs';

    // Mass assignable fields
    protected $fillable = [
        'subscription_id',
        'action',       // e.g., renew, upgrade, downgrade, status_change
        'notes',        // optional notes
        'start_date',   // subscription start date at the time of action
        'expiry_date',  // subscription expiry date at the time of action
        'status',       // active, cancelled, etc.
    ];

    // Relationship: Each log belongs to a subscription
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
