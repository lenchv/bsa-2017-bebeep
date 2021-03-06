<?php

namespace App\Criteria\Trips;

use App\User;
use Carbon\Carbon;
use App\Models\Booking;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

class PastDriverTripsCriteria implements CriteriaInterface
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function apply($model, RepositoryInterface $repository)
    {
        return $model->whereUserId($this->user->id)
            ->where('end_at', '<', Carbon::now()->toDateTimeString())
            ->with(['routes', 'vehicle', 'bookings' => function ($query) {
                $query->where('status', Booking::STATUS_PENDING);
            }])
            ->orderBy('start_at', 'desc')
            ->latest('id');
    }
}
