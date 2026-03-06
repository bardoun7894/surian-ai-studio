import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend-web';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/api/v1/${path}${searchParams ? `?${searchParams}` : ''}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...Object.fromEntries(
                    Array.from(request.headers.entries()).filter(([key]) =>
                        !['host', 'connection'].includes(key.toLowerCase())
                    )
                ),
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/api/v1/${path}`;

    try {
        const body = await request.json().catch(() => ({}));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...Object.fromEntries(
                    Array.from(request.headers.entries()).filter(([key]) =>
                        !['host', 'connection', 'content-length'].includes(key.toLowerCase())
                    )
                ),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/api/v1/${path}`;

    try {
        const body = await request.json().catch(() => ({}));

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...Object.fromEntries(
                    Array.from(request.headers.entries()).filter(([key]) =>
                        !['host', 'connection', 'content-length'].includes(key.toLowerCase())
                    )
                ),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/');
    const url = `${BACKEND_URL}/api/v1/${path}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...Object.fromEntries(
                    Array.from(request.headers.entries()).filter(([key]) =>
                        !['host', 'connection'].includes(key.toLowerCase())
                    )
                ),
            },
        });

        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
    }
}
