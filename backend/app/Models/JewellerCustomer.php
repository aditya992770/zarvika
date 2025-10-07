<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class JewellerCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'jeweller_id',
        'user_id',
        'full_name',
        'email',
        'mobile',
        'dob',
        'anniversary',
        'customer_type',
        'aadhar_number',
        'permanent_address',
        'residence_address',
        'kyc_documents',
        'assigned_staff_id'
    ];

    protected $casts = [
        'kyc_documents' => 'array',
    ];

    public function jeweller()
    {
        return $this->belongsTo(User::class, 'jeweller_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'assigned_staff_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
