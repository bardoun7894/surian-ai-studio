import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (query.length < 2) {
        return NextResponse.json({ suggestions: [] });
    }

    // Mock data for suggestions
    const mockSuggestions = [
        { text: 'Renew Business License', type: 'service', url: '/services/license-renewal' },
        { text: 'Register New Company', type: 'service', url: '/services/new-company' },
        { text: 'Investment Opportunities in Industry', type: 'investment', url: '/investments/industry' },
        { text: 'Import/Export Regulations', type: 'law', url: '/decrees/import-export' },
        { text: 'Ministry Contact Information', type: 'page', url: '/contact' },
        { text: 'Latest Economic News', type: 'news', url: '/news' },
        { text: 'Consumer Protection Law', type: 'law', url: '/decrees/consumer-protection' },
        { text: 'Industrial Zone Guidelines', type: 'guide', url: '/guides/industrial-zone' },
    ];

    const filteredSuggestions = mockSuggestions.filter(item =>
        item.text.toLowerCase().includes(query)
    );

    return NextResponse.json({ suggestions: filteredSuggestions });
}
