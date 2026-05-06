"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import {EventContentArg} from "@fullcalendar/core";
import {useRouter} from "next/navigation";
import {Meeting} from "@/generated/prisma";

type MeetingsCalendarProps = {
    meetings: Meeting[];
};

const MeetingsCalendar = ({ meetings }: MeetingsCalendarProps) => {
    const router = useRouter();

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            displayEventTime={true}
            progressiveEventRendering={true}
            eventClick={(arg) => router.push(`/meetings/${arg.event.id}`)}
            eventContent={(event: EventContentArg) => (
                <div style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    minWidth: 0,
                }}>
                    <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {event.event.title}
                    </p>
                </div>
            )}
            events={meetings.map((meeting) => ({
                id: meeting.id.toString(),
                title: meeting.title,
                description: meeting.description,
                date: new Date(meeting.startHour)
            }))}
            locale={document.cookie
                .split('; ')
                .find(row => row.startsWith('locale='))
                ?.split('=')[1]}
        />
    );
};

export default MeetingsCalendar;