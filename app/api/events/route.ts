export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      include: {
        _count: { select: { registrations: true } },
        creator: true,
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events.map(serializeEvent));
  } catch (error) {
    console.error("GET /api/events failed:", error);

    return NextResponse.json(
      { error: "Unable to load events" },
      { status: 500 }
    );
  }
}
