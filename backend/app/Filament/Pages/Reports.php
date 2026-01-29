<?php

namespace App\Filament\Pages;

use App\Models\Complaint;
use App\Models\Content;
use App\Models\Suggestion;
use App\Models\Service;
use App\Models\User;
use App\Models\ComplaintSummary;
use Filament\Pages\Page;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Illuminate\Support\Carbon;

class Reports extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar-square';

    protected static ?string $navigationGroup = 'التقارير وسجلات التدقيق';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'التقارير والإحصائيات';

    protected static ?string $navigationLabel = 'التقارير';

    protected static string $view = 'filament.pages.reports';

    public ?string $date_from = null;
    public ?string $date_to = null;

    public function mount(): void
    {
        $this->date_from = now()->subMonth()->format('Y-m-d');
        $this->date_to = now()->format('Y-m-d');
    }

    public function getStats(): array
    {
        $from = Carbon::parse($this->date_from)->startOfDay();
        $to = Carbon::parse($this->date_to)->endOfDay();

        return [
            'total_complaints' => Complaint::whereBetween('created_at', [$from, $to])->count(),
            'resolved_complaints' => Complaint::whereBetween('created_at', [$from, $to])->where('status', 'resolved')->count(),
            'pending_complaints' => Complaint::whereBetween('created_at', [$from, $to])->where('status', 'new')->count(),
            'in_progress_complaints' => Complaint::whereBetween('created_at', [$from, $to])->where('status', 'in_progress')->count(),
            'total_suggestions' => Suggestion::whereBetween('created_at', [$from, $to])->count(),
            'approved_suggestions' => Suggestion::whereBetween('created_at', [$from, $to])->where('status', 'approved')->count(),
            'total_content' => Content::whereBetween('created_at', [$from, $to])->count(),
            'total_users' => User::count(),
            'active_services' => Service::where('is_active', true)->count(),
        ];
    }

    public function getComplaintsByStatus(): array
    {
        $from = Carbon::parse($this->date_from)->startOfDay();
        $to = Carbon::parse($this->date_to)->endOfDay();

        return Complaint::whereBetween('created_at', [$from, $to])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getComplaintsByDirectorate(): array
    {
        $from = Carbon::parse($this->date_from)->startOfDay();
        $to = Carbon::parse($this->date_to)->endOfDay();

        return Complaint::whereBetween('created_at', [$from, $to])
            ->join('directorates', 'complaints.directorate_id', '=', 'directorates.id')
            ->selectRaw('directorates.name_ar as directorate, count(*) as count')
            ->groupBy('directorates.name_ar')
            ->pluck('count', 'directorate')
            ->toArray();
    }

    public function getRecentSummaries(): \Illuminate\Database\Eloquent\Collection
    {
        return ComplaintSummary::latest()->limit(5)->get();
    }

    public function getComplaintsTrend(): array
    {
        $from = Carbon::parse($this->date_from)->startOfDay();
        $to = Carbon::parse($this->date_to)->endOfDay();

        return Complaint::whereBetween('created_at', [$from, $to])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();
    }
}
