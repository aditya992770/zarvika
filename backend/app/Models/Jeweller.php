<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jeweller extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'address',
        'logo',
        'status',
    ];

    // Relationship: Jeweller belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
