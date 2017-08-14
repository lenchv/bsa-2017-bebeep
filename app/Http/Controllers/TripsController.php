<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Services\TripsService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreateTripRequest;
use App\Http\Requests\UpdateTripRequest;
use App\Exceptions\User\UserHasNotPermissionsToDeleteTripException;

class TripsController extends Controller
{
    /**
     * @var TripsService
     */
    private $tripsService;

    /**
     * TripsController constructor.
     * @param TripsService $tripsService
     */
    public function __construct(TripsService $tripsService)
    {
        $this->tripsService = $tripsService;
    }

    /**
     * @param CreateTripRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(CreateTripRequest $request)
    {
        $trip = $this->tripsService->create($request, Auth::user());

        return response()->json($trip);
    }

    /**
     * @param Trip $trip
     * @param UpdateTripRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Trip $trip, UpdateTripRequest $request)
    {
        $trip = $this->tripsService->update($trip, $request, Auth::user());

        return response()->json($trip);
    }

    /**
     * @param Trip $trip
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Trip $trip)
    {
        try {
            $this->tripsService->delete($trip, Auth::user());
        } catch (UserHasNotPermissionsToDeleteTripException $e) {
            return response()->json(['errors' => [$e->getMessage()]], 422);
        }

        return response()->json(['success' => true]);
    }
}