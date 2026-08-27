import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  X, 
  CheckCheck, 
  Trash2, 
  Inbox, 
  Calendar,
  Users,
  Flame,
  ChevronRight,
  Plane
} from 'lucide-react';
import { SystemNotification } from '../../types';

interface NotificationCenterProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigate?: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onClearAll,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'off_period' | 'rotation'>('all');

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const criticalCount = useMemo(() => {
    return notifications.filter(n => n.priority === 'critical' || n.type === 'alert').length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread') return !n.read;
      if (filter === 'critical') return n.priority === 'critical' || n.type === 'alert';
      if (filter === 'off_period') return n.category === 'off_period';
      if (filter === 'rotation') return n.category === 'rotation';
      return true;
    });
  }, [notifications, filter]);

  if (!isOpen) return null;

  const getCategoryIcon = (category?: string, type?: string) => {
    if (category === 'rotation') return <Plane size={14} />;
    if (category === 'off_period') return <Calendar size={14} />;
    
    if (type === 'alert') return <AlertCircle size={14} />;
    if (type === 'warning') return <AlertTriangle size={14} />;
    if (type === 'success') return <CheckCircle2 size={14} />;
    return <Info size={14} />;
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'off_period': return { label: 'Off-Period', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'rotation': return { label: 'Rotation', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default: return { label: 'Planner', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div 
      id="system-notification-center"
      className="absolute right-0 mt-3 w-[330px] sm:w-[400px] bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-slate-200 overflow-hidden z-[70] animate-in slide-in-from-top-2 fade-in duration-200"
    >
      {/* HEADER */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-white flex items-center justify-center">
            <Bell size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-xs">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-[9px] text-slate-300 font-medium mt-0.5">
              Off-period planner & team rotation alerts
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer"
          title="Close notifications"
        >
          <X size={16} />
        </button>
      </div>

      {/* FILTER TABS & BULK ACTIONS */}
      <div className="px-3 pt-2.5 pb-2 bg-slate-50 border-b border-slate-200/80 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All ({notifications.length})
          </button>
          
          <button
            onClick={() => setFilter('unread')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              filter === 'unread' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Unread ({unreadCount})
          </button>

          {criticalCount > 0 && (
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                filter === 'critical' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              <Flame size={11} />
              Urgent ({criticalCount})
            </button>
          )}

          <button
            onClick={() => setFilter('off_period')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              filter === 'off_period' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Off-Period
          </button>

          <button
            onClick={() => setFilter('rotation')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              filter === 'rotation' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Rotations
          </button>
        </div>

        {/* QUICK CLEAR / MARK READ TOOLBAR */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-1 pt-1 border-t border-slate-200/50">
          <span className="text-[9px] text-slate-400">Showing {filteredNotifications.length} alerts</span>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-slate-700 hover:text-black font-bold transition-colors cursor-pointer"
                title="Mark all alerts as read"
              >
                <CheckCheck size={12} className="text-emerald-600" />
                Mark all read
              </button>
            )}
            
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 size={11} />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto divide-y divide-slate-100 bg-white">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox size={22} />
            </div>
            <p className="text-xs font-bold text-slate-700">No Notifications</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[240px] mx-auto">
              All off-period schedules, team departures, and rotation arrivals are up to date.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const badge = getCategoryBadge(notification.category);
            const isAlert = notification.type === 'alert' || notification.priority === 'critical';
            const isWarning = notification.type === 'warning' || notification.priority === 'high';
            const isSuccess = notification.type === 'success';

            return (
              <div 
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    onMarkAsRead(notification.id);
                  }
                }}
                className={`p-3.5 sm:p-4 hover:bg-slate-50/80 transition-all flex gap-3 items-start group relative cursor-pointer ${
                  !notification.read ? 'bg-indigo-50/20' : ''
                }`}
              >
                {/* ICON BADGE */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border shadow-2xs ${
                  isAlert ? 'bg-rose-50 text-rose-600 border-rose-200' :
                  isWarning ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  isSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {getCategoryIcon(notification.category, notification.type)}
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border ${badge.bg}`}>
                      {badge.label}
                    </span>

                    {notification.priority === 'critical' && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-rose-600 text-white">
                        Urgent
                      </span>
                    )}

                    {!notification.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-auto"></span>
                    )}
                  </div>

                  <h5 className="text-[11px] font-black text-slate-900 leading-tight mb-1">
                    {notification.title}
                  </h5>
                  
                  <p className="text-[10px] font-normal text-slate-600 leading-relaxed mb-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>
                        {typeof notification.timestamp === 'string'
                          ? notification.timestamp
                          : new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* ACTION BUTTON (NAVIGATE TO OFF PLANNER) */}
                    {notification.targetTab && onNavigate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                          onNavigate(notification.targetTab!);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group-hover:underline"
                      >
                        <span>{notification.actionLabel || 'View Planner'}</span>
                        <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* INDIVIDUAL DISMISS BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification(notification.id);
                  }}
                  className="opacity-40 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-all cursor-pointer self-start shrink-0"
                  title="Dismiss notification"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[9px] text-slate-400 font-medium">
          Startec Shift & Off-Period Planner
        </span>
        <button 
          onClick={onClose}
          className="text-[9px] font-black text-slate-600 hover:text-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
