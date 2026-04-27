import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X, Info, Bell, Volume2 } from "lucide-react";

export function Notification({ message, onClose, type = "success", duration = 3000, sound = false }) {
  const [isExiting, setIsExiting] = useState(false);

  // تشغيل صوت إذا كان مطلوب
  useEffect(() => {
    if (sound) {
      const audio = new Audio('/notification.mp3'); // ضع ملف صوت في public folder
      audio.play().catch(e => console.log("Audio non supporté"));
    }
  }, [sound]);

  // إغلاق تلقائي مع أنيميشن
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // وقت الأنيميشن
  };

  // الألوان حسب النوع
  const colors = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      border: "border-green-400",
      icon: <CheckCircle size={22} className="text-white" />,
      title: "Succès !"
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      border: "border-red-400",
      icon: <AlertCircle size={22} className="text-white" />,
      title: "Erreur !"
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
      border: "border-yellow-400",
      icon: <AlertCircle size={22} className="text-white" />,
      title: "Attention !"
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      border: "border-blue-400",
      icon: <Info size={22} className="text-white" />,
      title: "Information"
    }
  };

  const currentColor = colors[type] || colors.success;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className={`
          ${currentColor.bg} 
          text-white rounded-xl shadow-2xl 
          transform transition-all duration-300 ease-out
          ${isExiting ? 'opacity-0 translate-x-20' : 'opacity-100 translate-x-0'}
          animate-slide-in-right
        `}
      >
        <div className="flex items-start gap-3 p-4 min-w-[320px] max-w-md">
          {/* أيقونة */}
          <div className="flex-shrink-0">
            {currentColor.icon}
          </div>
          
          {/* المحتوى */}
          <div className="flex-1">
            <h4 className="font-bold text-sm uppercase tracking-wide">
              {currentColor.title}
            </h4>
            <p className="text-sm mt-1 opacity-90">{message}</p>
            
            {/* بار التقدم */}
            <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-linear"
                style={{ 
                  width: '100%',
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
          </div>
          
          {/* زر الإغلاق */}
          <button 
            onClick={handleClose} 
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-all duration-200 hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// ============================================
// مكون لإدارة الإشعارات المتعددة (Notification Manager)
// ============================================
export function NotificationManager() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // إزالة تلقائية بعد المدة
    setTimeout(() => {
      removeNotification(id);
    }, duration + 500);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          duration={notif.duration}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
}

// ============================================
// Hook pour utiliser les notifications facilement
// ============================================
export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration + 500);
    
    return id;
  };

  const showSuccess = (message, duration = 3000) => showNotification(message, "success", duration);
  const showError = (message, duration = 4000) => showNotification(message, "error", duration);
  const showWarning = (message, duration = 3500) => showNotification(message, "warning", duration);
  const showInfo = (message, duration = 3000) => showNotification(message, "info", duration);

  const NotificationComponent = () => (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          duration={notif.duration}
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
        />
      ))}
    </div>
  );

  return { showSuccess, showError, showWarning, showInfo, NotificationComponent };
}