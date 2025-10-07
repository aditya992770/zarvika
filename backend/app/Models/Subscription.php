<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'jeweller_id',
        'start_date',
        'expiry_date',
        'status'
    ];

    // Relation with Jeweller
    public function jeweller()
    {
        return $this->belongsTo(Jeweller::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function logs()
    {
        return $this->hasMany(SubscriptionLog::class);
    }
}
