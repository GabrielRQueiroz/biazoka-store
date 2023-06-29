import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const imagesResponse = await fetch(`https://serpapi.com/search?${new URLSearchParams(searchParams)}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
	}).then((res) => res.json());

	return NextResponse.json(imagesResponse, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		},
	});
}
