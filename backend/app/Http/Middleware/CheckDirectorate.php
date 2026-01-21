<?php

namespace App\Http\Middleware;

use App\Models\Complaint;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDirectorate
{
    /**
     * FR-26: Handle directorate-based access control.
     *
     * Staff users can only access complaints from their assigned directorate.
     * Admins (with directorates.* permission) can access all.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Admins can access everything
        if ($this->isAdmin($user)) {
            return $next($request);
        }

        // Check complaint access for routes like /staff/complaints/{id}
        $complaintId = $request->route('id') ?? $request->route('complaint_id');
        if ($complaintId && $this->isComplaintRoute($request)) {
            $complaint = Complaint::find($complaintId);

            if ($complaint && !$this->canAccessComplaint($user, $complaint)) {
                return response()->json([
                    'message' => 'غير مصرح لك بالوصول إلى هذه الشكوى.',
                    'error' => 'Unauthorized access to this complaint.'
                ], 403);
            }
        }

        // Check directorate_id in route or request
        $directorateId = $request->route('directorate_id') ?? $request->input('directorate_id');
        if ($directorateId && !$this->canAccessDirectorate($user, $directorateId)) {
            return response()->json([
                'message' => 'غير مصرح لك بالوصول إلى هذه المديرية.',
                'error' => 'Unauthorized access to this directorate.'
            ], 403);
        }

        return $next($request);
    }

    /**
     * Check if user is admin (has broad access)
     */
    protected function isAdmin($user): bool
    {
        return $user->hasPermission('directorates.*') ||
               $user->hasPermission('*') ||
               $user->hasRole('admin.super') ||
               $user->hasRole('admin.general') ||
               is_null($user->directorate_id); // Admins typically have null directorate_id
    }

    /**
     * Check if user can access a specific complaint
     */
    protected function canAccessComplaint($user, Complaint $complaint): bool
    {
        // User with no directorate restriction can access all
        if (is_null($user->directorate_id)) {
            return true;
        }

        // Staff can only access complaints from their directorate
        return $user->directorate_id === $complaint->directorate_id;
    }

    /**
     * Check if user can access a specific directorate
     */
    protected function canAccessDirectorate($user, $directorateId): bool
    {
        if (is_null($user->directorate_id)) {
            return true;
        }

        return (int) $user->directorate_id === (int) $directorateId;
    }

    /**
     * Check if current route is a complaint-related route
     */
    protected function isComplaintRoute(Request $request): bool
    {
        $path = $request->path();
        return str_contains($path, 'complaints');
    }

    /**
     * Get user's directorate ID (for query filtering)
     */
    public static function getUserDirectorateId($user): ?int
    {
        if (!$user) {
            return null;
        }

        // Admins see all (return null = no filter)
        if ($user->hasPermission('directorates.*') ||
            $user->hasPermission('*') ||
            $user->hasRole('admin.super') ||
            $user->hasRole('admin.general')) {
            return null;
        }

        return $user->directorate_id;
    }
}
