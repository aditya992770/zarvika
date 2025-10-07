<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerKitty extends Model
{
    use HasFactory;

    // Let Eloquent use auto-increment integer ID
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'kitty_id', 'customer_id', 'kitty_name', 'kitty_type',
        'start_date', 'end_date', 'target_amount', 'collected_amount',
        'status', 'notes', 'created_by'
    ];

    // Remove the boot() UUID generator entirely

    public function customer() {
        return $this->belongsTo(JewellerCustomer::class, 'customer_id');
    }

    // Relationship to Kitty
    public function kitty()
    {
        return $this->belongsTo(Kitty::class, 'kitty_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
