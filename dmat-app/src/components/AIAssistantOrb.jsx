import { useState, useEffect, useRef } from 'react';
import { useAI } from '../context/AIContext.jsx';

export default function AIAssistantOrb() {
  const { isOpen, setIsOpen, isSimulationActive, isStreaming } = useAI();

  // Position state (default: bottom-right corner)
  const [pos, setPos] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const orbRef = useRef(null);
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
    moved: false
  });

  const ORB_SIZE = 56;
  const MARGIN = 20;

  // Initialize position once window size is available
  useEffect(() => {
    const initX = window.innerWidth - ORB_SIZE - MARGIN;
    const initY = window.innerHeight - ORB_SIZE - MARGIN;
    setPos({ x: initX, y: initY });

    const handleResize = () => {
      setPos(prev => {
        if (prev.x === null) return prev;
        const newX = prev.x > window.innerWidth / 2 ? window.innerWidth - ORB_SIZE - MARGIN : MARGIN;
        const newY = Math.min(Math.max(MARGIN, prev.y), window.innerHeight - ORB_SIZE - MARGIN);
        return { x: newX, y: newY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer drag handlers
  const handlePointerDown = (e) => {
    // Only left click / single touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: Date.now(),
      vx: 0,
      vy: 0,
      moved: false
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const now = Date.now();
    const dt = Math.max(1, now - dragInfo.current.lastTime);
    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    // Track velocity for inertia
    dragInfo.current.vx = (e.clientX - dragInfo.current.lastX) / dt;
    dragInfo.current.vy = (e.clientY - dragInfo.current.lastY) / dt;
    dragInfo.current.lastX = e.clientX;
    dragInfo.current.lastY = e.clientY;
    dragInfo.current.lastTime = now;

    if (Math.hypot(dx, dy) > 5) {
      dragInfo.current.moved = true;
    }

    const nextX = Math.min(Math.max(MARGIN, dragInfo.current.initialX + dx), window.innerWidth - ORB_SIZE - MARGIN);
    const nextY = Math.min(Math.max(MARGIN, dragInfo.current.initialY + dy), window.innerHeight - ORB_SIZE - MARGIN);

    setPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Check if it was a click vs a drag
    if (!dragInfo.current.moved) {
      setIsOpen(prev => !prev);
      return;
    }

    // Apply inertia and snap to nearest edge
    const finalVx = dragInfo.current.vx || 0;
    const finalVy = dragInfo.current.vy || 0;

    // Projected position with subtle momentum
    const projectedX = pos.x + finalVx * 120;
    const projectedY = pos.y + finalVy * 120;

    // Edge snapping: snap to left edge or right edge
    const snapToLeft = projectedX + ORB_SIZE / 2 < window.innerWidth / 2;
    const snappedX = snapToLeft ? MARGIN : window.innerWidth - ORB_SIZE - MARGIN;
    const snappedY = Math.min(Math.max(MARGIN, projectedY), window.innerHeight - ORB_SIZE - MARGIN);

    setPos({ x: snappedX, y: snappedY });
  };

  // Rule: Automatically disabled during Exam Simulation
  if (isSimulationActive || pos.x === null) {
    return null;
  }

  // Floating offset animation (disabled during dragging)
  const isSnappedLeft = pos.x < window.innerWidth / 2;

  return (
    <div
      ref={orbRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${ORB_SIZE}px`,
        height: `${ORB_SIZE}px`,
        borderRadius: '50%',
        zIndex: 900,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'left 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), top 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), transform 0.2s ease, box-shadow 0.2s ease',
        transform: isHovered && !isDragging ? 'scale(1.08)' : 'scale(1)',
        filter: isHovered ? 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.7))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
      }}
      title="dMAT AI Coach"
    >
      {/* Outer Floating Shell */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #3b82f6 40%, #1e1b4b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isStreaming
            ? '0 0 24px rgba(168, 85, 247, 0.8), inset 0 0 12px rgba(255, 255, 255, 0.4)'
            : '0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.35)',
          animation: !isDragging ? 'ai-orb-float 3.5s ease-in-out infinite' : 'none',
          position: 'relative'
        }}
      >
        {/* Core Icon / AI Iris */}
        <div
          style={{
            fontSize: '1.4rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
            transform: isStreaming ? 'rotate(180deg)' : 'none',
            transition: 'transform 1s ease'
          }}
        >
          {isStreaming ? '⚡' : '✦'}
        </div>

        {/* Pulse Ring when Active/Streaming */}
        {isStreaming && (
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid var(--purple-400)',
              animation: 'ai-orb-pulse 1.4s ease-out infinite'
            }}
          />
        )}
      </div>

      {/* Tooltip Badge on Hover */}
      {isHovered && !isDragging && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            [isSnappedLeft ? 'left' : 'right']: `${ORB_SIZE + 12}px`,
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--blue-500)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            fontSize: '0.75rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
            animation: 'ai-fade-in 0.15s ease'
          }}
        >
          <span style={{ color: 'var(--blue-400)' }}>✦</span>
          <span>dMAT AI Coach</span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.2)', padding: '1px 6px', borderRadius: 4, color: 'var(--blue-400)' }}>
            OmniRoute
          </span>
        </div>
      )}
    </div>
  );
}
