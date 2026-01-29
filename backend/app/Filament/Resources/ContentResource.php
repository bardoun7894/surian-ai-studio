<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContentResource\Pages;
use App\Filament\Resources\ContentResource\RelationManagers;
use App\Models\Content;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ContentResource extends Resource
{
    protected static ?string $model = Content::class;

    protected static ?string $navigationIcon = 'heroicon-m-document-text';

    protected static ?string $navigationGroup = 'إدارة المحتوى';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\Select::make('category')
                            ->options([
                                Content::CATEGORY_NEWS => 'News',
                                Content::CATEGORY_ANNOUNCEMENT => 'Announcement',
                                Content::CATEGORY_DECREE => 'Decree',
                                Content::CATEGORY_SERVICE => 'Service',
                                Content::CATEGORY_FAQ => 'FAQ',
                                Content::CATEGORY_ABOUT => 'About',
                                Content::CATEGORY_MEDIA => 'Media',
                            ])
                            ->required()
                            ->searchable(),
                        Forms\Components\Select::make('status')
                            ->options([
                                Content::STATUS_DRAFT => 'Draft',
                                Content::STATUS_PUBLISHED => 'Published',
                                Content::STATUS_ARCHIVED => 'Archived',
                            ])
                            ->required()
                            ->default(Content::STATUS_DRAFT),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->default(now()),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('priority')
                            ->numeric()
                            ->default(0),
                         Forms\Components\Toggle::make('featured')
                            ->default(false),
                    ])->columns(2),

                Forms\Components\Tabs::make('Content')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Arabic')
                            ->schema([
                                Forms\Components\Group::make()
                                    ->schema([
                                        Forms\Components\TextInput::make('title_ar')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                                        Forms\Components\Actions::make([
                                            Forms\Components\Actions\Action::make('suggest_titles_ar')
                                                ->label('اقتراح عناوين')
                                                ->icon('heroicon-o-sparkles')
                                                ->color('info')
                                                ->requiresConfirmation(false)
                                                ->action(function (Forms\Get $get, Forms\Set $set) {
                                                    $content = $get('content_ar');
                                                    if (!$content) {
                                                        \Filament\Notifications\Notification::make()
                                                            ->warning()
                                                            ->title('يجب كتابة المحتوى أولاً')
                                                            ->send();
                                                        return;
                                                    }

                                                    $aiService = app(\App\Services\AIService::class);
                                                    $titles = $aiService->suggestTitles($content, $get('category') ?? 'news', 'ar');

                                                    if (!empty($titles)) {
                                                        $set('title_ar', $titles[0] ?? $titles['title_ar'] ?? '');
                                                        \Filament\Notifications\Notification::make()
                                                            ->success()
                                                            ->title('تم اقتراح عنوان')
                                                            ->send();
                                                    }
                                                }),
                                        ])->columnSpanFull(),
                                    ]),

                                Forms\Components\RichEditor::make('content_ar')
                                    ->required()
                                    ->columnSpanFull(),

                                Forms\Components\Actions::make([
                                    Forms\Components\Actions\Action::make('proofread_ar')
                                        ->label('تدقيق لغوي')
                                        ->icon('heroicon-o-check-circle')
                                        ->color('warning')
                                        ->requiresConfirmation(false)
                                        ->action(function (Forms\Get $get, Forms\Set $set) {
                                            $content = $get('content_ar');
                                            if (!$content) {
                                                \Filament\Notifications\Notification::make()
                                                    ->warning()
                                                    ->title('لا يوجد محتوى للتدقيق')
                                                    ->send();
                                                return;
                                            }

                                            $aiService = app(\App\Services\AIService::class);
                                            $result = $aiService->proofread($content, 'ar');

                                            if ($result && isset($result['corrected_text'])) {
                                                $set('content_ar', $result['corrected_text']);
                                                \Filament\Notifications\Notification::make()
                                                    ->success()
                                                    ->title('تم التدقيق اللغوي')
                                                    ->body($result['changes_count'] ? "تم إجراء {$result['changes_count']} تصحيحات" : 'لم يتم العثور على أخطاء')
                                                    ->send();
                                            }
                                        }),
                                ])->columnSpanFull(),

                                Forms\Components\Textarea::make('seo_description_ar')
                                    ->label('SEO Description (AR)')
                                    ->rows(2),

                                Forms\Components\Actions::make([
                                    Forms\Components\Actions\Action::make('summarize_ar')
                                        ->label('إنشاء ملخص تلقائي')
                                        ->icon('heroicon-o-document-text')
                                        ->color('success')
                                        ->requiresConfirmation(false)
                                        ->action(function (Forms\Get $get, Forms\Set $set) {
                                            $content = $get('content_ar');
                                            if (!$content) {
                                                \Filament\Notifications\Notification::make()
                                                    ->warning()
                                                    ->title('لا يوجد محتوى للتلخيص')
                                                    ->send();
                                                return;
                                            }

                                            $aiService = app(\App\Services\AIService::class);
                                            $summary = $aiService->summarize($content, 'ar');

                                            if ($summary) {
                                                $set('seo_description_ar', $summary);
                                                \Filament\Notifications\Notification::make()
                                                    ->success()
                                                    ->title('تم إنشاء الملخص')
                                                    ->send();
                                            }
                                        }),
                                ])->columnSpanFull(),
                            ]),
                        Forms\Components\Tabs\Tab::make('English')
                            ->schema([
                                Forms\Components\Group::make()
                                    ->schema([
                                        Forms\Components\TextInput::make('title_en')
                                            ->maxLength(255),
                                        Forms\Components\Actions::make([
                                            Forms\Components\Actions\Action::make('suggest_titles_en')
                                                ->label('Suggest Titles')
                                                ->icon('heroicon-o-sparkles')
                                                ->color('info')
                                                ->requiresConfirmation(false)
                                                ->action(function (Forms\Get $get, Forms\Set $set) {
                                                    $content = $get('content_en');
                                                    if (!$content) {
                                                        \Filament\Notifications\Notification::make()
                                                            ->warning()
                                                            ->title('Content is required first')
                                                            ->send();
                                                        return;
                                                    }

                                                    $aiService = app(\App\Services\AIService::class);
                                                    $titles = $aiService->suggestTitles($content, $get('category') ?? 'news', 'en');

                                                    if (!empty($titles)) {
                                                        $set('title_en', $titles[0] ?? $titles['title_en'] ?? '');
                                                        \Filament\Notifications\Notification::make()
                                                            ->success()
                                                            ->title('Title suggested')
                                                            ->send();
                                                    }
                                                }),
                                        ])->columnSpanFull(),
                                    ]),

                                Forms\Components\RichEditor::make('content_en')
                                    ->columnSpanFull(),

                                Forms\Components\Actions::make([
                                    Forms\Components\Actions\Action::make('proofread_en')
                                        ->label('Proofread')
                                        ->icon('heroicon-o-check-circle')
                                        ->color('warning')
                                        ->requiresConfirmation(false)
                                        ->action(function (Forms\Get $get, Forms\Set $set) {
                                            $content = $get('content_en');
                                            if (!$content) {
                                                \Filament\Notifications\Notification::make()
                                                    ->warning()
                                                    ->title('No content to proofread')
                                                    ->send();
                                                return;
                                            }

                                            $aiService = app(\App\Services\AIService::class);
                                            $result = $aiService->proofread($content, 'en');

                                            if ($result && isset($result['corrected_text'])) {
                                                $set('content_en', $result['corrected_text']);
                                                \Filament\Notifications\Notification::make()
                                                    ->success()
                                                    ->title('Proofreading complete')
                                                    ->body($result['changes_count'] ? "Made {$result['changes_count']} corrections" : 'No errors found')
                                                    ->send();
                                            }
                                        }),
                                ])->columnSpanFull(),

                                Forms\Components\Textarea::make('seo_description_en')
                                    ->label('SEO Description (EN)')
                                    ->rows(2),

                                Forms\Components\Actions::make([
                                    Forms\Components\Actions\Action::make('summarize_en')
                                        ->label('Auto Generate Summary')
                                        ->icon('heroicon-o-document-text')
                                        ->color('success')
                                        ->requiresConfirmation(false)
                                        ->action(function (Forms\Get $get, Forms\Set $set) {
                                            $content = $get('content_en');
                                            if (!$content) {
                                                \Filament\Notifications\Notification::make()
                                                    ->warning()
                                                    ->title('No content to summarize')
                                                    ->send();
                                                return;
                                            }

                                            $aiService = app(\App\Services\AIService::class);
                                            $summary = $aiService->summarize($content, 'en');

                                            if ($summary) {
                                                $set('seo_description_en', $summary);
                                                \Filament\Notifications\Notification::make()
                                                    ->success()
                                                    ->title('Summary generated')
                                                    ->send();
                                            }
                                        }),
                                ])->columnSpanFull(),
                            ]),
                    ])->columnSpanFull(),

                Forms\Components\Section::make('Metadata')
                    ->schema([
                         Forms\Components\FileUpload::make('metadata.image')
                            ->label('Featured Image')
                            ->image()
                            ->directory('content-images'),
                         Forms\Components\TagsInput::make('tags'),
                    ])->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title_ar')
                    ->label('Title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        Content::CATEGORY_NEWS => 'News',
                        Content::CATEGORY_ANNOUNCEMENT => 'Announcement',
                        Content::CATEGORY_DECREE => 'Decree',
                        Content::CATEGORY_SERVICE => 'Service',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        Content::CATEGORY_NEWS => 'info',
                        Content::CATEGORY_ANNOUNCEMENT => 'warning',
                        Content::CATEGORY_DECREE => 'danger',
                        Content::CATEGORY_SERVICE => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Content::STATUS_PUBLISHED => 'success',
                        Content::STATUS_DRAFT => 'gray',
                        Content::STATUS_ARCHIVED => 'danger',
                    }),
                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Author')
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        Content::CATEGORY_NEWS => 'News',
                        Content::CATEGORY_ANNOUNCEMENT => 'Announcement',
                        Content::CATEGORY_DECREE => 'Decree',
                        Content::CATEGORY_SERVICE => 'Service',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        Content::STATUS_DRAFT => 'Draft',
                        Content::STATUS_PUBLISHED => 'Published',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user = auth()->user();

        // Non-super-admin users with a directorate only see their directorate's content
        if ($user && !$user->hasRole('super_admin') && $user->directorate_id) {
            $query->where('author_id', $user->id)
                  ->orWhereHas('author', function (Builder $q) use ($user) {
                      $q->where('directorate_id', $user->directorate_id);
                  });
        }

        return $query;
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\VersionsRelationManager::class,
            RelationManagers\AttachmentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContents::route('/'),
            'create' => Pages\CreateContent::route('/create'),
            'edit' => Pages\EditContent::route('/{record}/edit'),
        ];
    }
}
