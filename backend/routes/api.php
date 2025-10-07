<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JewellerController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\JewellerStaffController;
use App\Http\Controllers\JewellerCustomerController;
use App\Http\Controllers\KittyController;
use App\Http\Controllers\CustomerKittyController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

###################################### For Admin Profile ################################################

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Jeweller Routes
    Route::get('/jewellers', [JewellerController::class, 'index']);
    Route::post('/jewellers', [JewellerController::class, 'store']);
    Route::get('/jewellers/{id}', [JewellerController::class, 'show']);
    Route::post('/jewellers/{id}/reset-credentials', [JewellerController::class, 'resetCredentials']);
    // Subscription routes
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::post('/subscriptions/{id}/update-status', [SubscriptionController::class, 'updateStatus']);
    Route::post('/subscriptions/{id}/update-plan', [SubscriptionController::class, 'updatePlan']);
    Route::get('/subscriptions/{id}/logs', [SubscriptionController::class, 'logs']);
});

####################################### For Jewellers Profile ####################################################

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/staff', [JewellerStaffController::class, 'index']);
    Route::post('/staff', [JewellerStaffController::class, 'store']);
    Route::post('/staff/{id}/reset-credentials', [JewellerStaffController::class, 'resetCredentials']);

    Route::get('/jeweller-customers', [JewellerCustomerController::class, 'index']);
    Route::post('/jeweller-customers', [JewellerCustomerController::class, 'store']);
    Route::get('/jeweller-customers/{id}', [JewellerCustomerController::class, 'show']);
    Route::put('/jeweller-customers/{id}', [JewellerCustomerController::class, 'update']);
    Route::delete('/jeweller-customers/{id}', [JewellerCustomerController::class, 'destroy']);
    Route::post('/jeweller-customers/{id}/reset-credentials', [JewellerCustomerController::class, 'resetCredentials']);

    Route::get('customer-kitties', [CustomerKittyController::class, 'index']);
    Route::post('customer-kitties', [CustomerKittyController::class, 'store']);
    Route::get('customer-kitties/view/{id}', [CustomerKittyController::class, 'show']);
    Route::put('customer-kitties/{id}', [CustomerKittyController::class, 'update']);
    Route::delete('customer-kitties/{id}', [CustomerKittyController::class, 'destroy']);


    Route::prefix('kitties')->group(function () {
        Route::get('/', [KittyController::class, 'index']);
        Route::post('/', [KittyController::class, 'store']);
        Route::get('/{id}', [KittyController::class, 'show']);
        Route::put('/{id}', [KittyController::class, 'update']);
        Route::delete('/{id}', [KittyController::class, 'destroy']);

        Route::post('/{id}/pause', [KittyController::class, 'pause']);
        Route::post('/{id}/resume', [KittyController::class, 'resume']);
    });

});

// Get dashboard stats
Route::middleware('auth:sanctum')->get('/dashboard/stats', [JewellerController::class, 'dashboardStats']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
