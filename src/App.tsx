import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, CheckCircle2, Archive, Sparkles } from 'lucide-react';
import { SwipeableTaskCard } from './components/SwipeableTaskCard';
import { CelebrationSplash } from './components/CelebrationSplash';
import { Calendar } from './components/Calendar';

interface Task {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'draft' | 'completed';
  assignedDate: string;
  createdAt: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'today' | 'draft' | 'completed'>('today');
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('clearLoopTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('clearLoopTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() && selectedDate) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        date: selectedDate,
        status: 'active',
        assignedDate: selectedDate,
        createdAt: Date.now(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const handleSwipeRight = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setCompletedTaskTitle(task.title);
      setShowCelebration(true);
    }
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleSwipeLeft = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'draft' as const }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatShortDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const todayTasks = tasks.filter(task => task.status === 'active' && task.date === selectedDate);
  const draftTasks = tasks.filter(task => task.status === 'draft');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Ultra Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Clear Loop
                </h1>
                <p className="text-gray-600 text-sm">Track your daily tasks with ease</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  activeTab === 'today' 
                    ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Today
                {todayTasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {todayTasks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  activeTab === 'draft' 
                    ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Draft
                {draftTasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {draftTasks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative ${
                  activeTab === 'completed' 
                    ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed
                {completedTasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {completedTasks.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Task Section */}
        {activeTab === 'today' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
                  <p className="text-gray-600">What would you like to accomplish today?</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter your task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowCalendar(true)}
                      className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white transition-all duration-300 shadow-sm"
                    >
                      <CalendarIcon className="text-gray-600" size={20} />
                      <span className="text-gray-900 font-medium">{formatShortDate(selectedDate)}</span>
                    </button>
                  </div>
                  <button
                    onClick={addTask}
                    disabled={!newTask.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {activeTab === 'today' && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
                  <p className="text-gray-600">{formatDate(selectedDate)}</p>
                </div>
              </div>
              
              {todayTasks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CalendarIcon className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No tasks for today</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Start your productive day by adding your first task above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map(task => (
                      <SwipeableTaskCard 
                        key={task.id} 
                        task={task} 
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        onDelete={deleteTask}
                        formatDate={formatDate}
                        showLeftSwipe={true}
                        onAnimationComplete={() => {}}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'draft' && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Archive className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Draft Tasks</h2>
                  <p className="text-gray-600">Tasks waiting to be completed</p>
                </div>
              </div>
              
              {draftTasks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Archive className="text-orange-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No draft tasks</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Tasks moved to draft will appear here for later completion</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftTasks
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map(task => (
                      <SwipeableTaskCard 
                        key={task.id} 
                        task={task} 
                        onSwipeRight={handleSwipeRight}
                        onDelete={deleteTask}
                        formatDate={formatDate}
                        showLeftSwipe={false}
                        onAnimationComplete={() => {}}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Completed Tasks</h2>
                  <p className="text-gray-600">Your accomplishments and finished work</p>
                </div>
              </div>
              
              {completedTasks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No completed tasks yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Completed tasks will appear here to celebrate your progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedTasks
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map(task => (
                      <div key={task.id} className="group bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl border border-green-200/50 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-green-800 line-through decoration-2 decoration-green-400 mb-2">
                              {task.title}
                            </h3>
                            <p className="text-sm text-green-600 flex items-center gap-2 font-medium">
                              <CheckCircle2 size={16} />
                              Completed • Originally assigned on {formatDate(task.assignedDate)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Calendar Modal */}
      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
      
      {/* Celebration Splash */}
      <CelebrationSplash 
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
        taskTitle={completedTaskTitle}
      />
    </div>
  );
}

export default App;