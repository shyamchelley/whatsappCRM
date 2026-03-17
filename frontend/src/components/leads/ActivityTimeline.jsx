import { formatDateTime } from '../../utils/formatters';

const TYPE_CONFIG = {
  lead_created:      { icon: '🌱', color: 'bg-green-100 text-green-700' },
  stage_change:      { icon: '🔀', color: 'bg-blue-100 text-blue-700' },
  note_added:        { icon: '📝', color: 'bg-yellow-100 text-yellow-700' },
  whatsapp_received: { icon: '💬', color: 'bg-emerald-100 text-emerald-700' },
  whatsapp_sent:     { icon: '📤', color: 'bg-teal-100 text-teal-700' },
  reminder_set:      { icon: '⏰', color: 'bg-amber-100 text-amber-700' },
  manual:            { icon: '✏️', color: 'bg-gray-100 text-gray-700' },
};

export default function ActivityTimeline({ activities }) {
  if (!activities.length) {
    return <p className="text-sm text-gray-400 py-4">No activity yet.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-4">
        {activities.map((activity, idx) => {
          const cfg = TYPE_CONFIG[activity.type] || TYPE_CONFIG.manual;
          return (
            <li key={activity.id}>
              <div className="relative pb-4">
                {idx < activities.length - 1 && (
                  <span className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-sm ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {activity.user_name && (
                        <span className="text-xs text-gray-400">{activity.user_name} ·</span>
                      )}
                      <span className="text-xs text-gray-400">{formatDateTime(activity.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
