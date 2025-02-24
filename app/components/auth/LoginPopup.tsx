import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from '@remix-run/react';
import { supabase } from '~/lib/supabase';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { TypeAnimation } from 'react-type-animation';

interface LoginPopupProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function LoginPopup({ onSuccess, onClose }: LoginPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const upsertUser = useMutation(api.users.upsertUser);
  const [demoStep, setDemoStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const demoPrompts = [
    "Design a profile page with bio",
    "Create a login and registration page with form validation",
    "Generate a user dashboard with charts",
    "Build a real-time chat component",
    "Create a to-do list app with drag-and-drop functionality"
  ];

  const demoCode = [
    `const ProfileCard = () => {
  const user = {
    name: "Sarah Chen",
    role: "Senior Developer",
    location: "San Francisco, CA",
    bio: "Building the future with AI",
    stats: { contributions: "2.4k", followers: "1.2k", following: "891" }
  };
  return (/* ... */);
};`,
    `const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const validate = () => {
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return 'Invalid email address';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

        <Tabs value={isLogin ? 'login' : 'register'}>
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <Form onSubmit={handleSubmit}>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          {!isLogin && (
            <Input type="password" placeholder="Confirm Password" />
          )}
          <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
        </Form>
      </Tabs>
    </div>
  );
};`,
    `const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const { data, isLoading } = useAnalytics(timeframe);

  const metrics = [
    { title: 'Revenue', value: '$12.4k', trend: '+12%', icon: 'trend-up' },
    { title: 'Users', value: '1,234', trend: '+8%', icon: 'users' },
    { title: 'Conversion', value: '2.4%', trend: '+3%', icon: 'chart-line' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics Overview</h2>
        <TimeframeSelect value={timeframe} onChange={setTimeframe} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {metrics.map(metric => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <BarChart data={data.monthly} />
        <LineChart data={data.growth} />
      </div>
    </div>
  );
};`,
    `const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useWebSocket('wss://api.example.com/chat');
  
  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('message', {
      text: input,
      user: currentUser,
      timestamp: new Date()
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input value={input} onChange={setInput} />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};`,
    `const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">My Tasks</h2>
          <Select value={filter} onChange={setFilter}>
            <option value="all">All Tasks</option>
            <option value="active">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <TaskItem
                      task={task}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <AddTaskInput onAdd={(text) => setTasks([...tasks, { id: uuid(), text }])} />
      </div>
    </DragDropContext>
  );
};`
  ];

  const demoComponents = [
    // Profile Card Demo
    <div key="profile" className="bg-[#1A1B1E] rounded-lg p-6 space-y-6">
      <div className="flex flex-col items-center">
      <img
      src="/ava.jpg" 
      alt="Avatar"
      className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
    />
        <h2 className="text-xl font-bold mt-4 text-white">Alex Johnson</h2>
        <p className="text-gray-400">Senior Developer</p>
        <p className="text-gray-500">New York, NY</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-[#ff69b4] text-xl font-bold">2.4k</div>
          <div className="text-gray-500 text-sm">Contributions</div>
        </div>
        <div>
          <div className="text-[#ff69b4] text-xl font-bold">1.2k</div>
          <div className="text-gray-500 text-sm">Followers</div>
        </div>
        <div>
          <div className="text-[#ff69b4] text-xl font-bold">891</div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
      </div>
    </div>,

    // Auth Form Preview
    <div key="auth" className="bg-[#1A1B1E] rounded-lg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-1">Welcome Back</h3>
          <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button className="flex items-center justify-center gap-2 py-2 px-3 
            bg-[#2E2F33] rounded-lg hover:bg-[#3E3F43] transition-all duration-200 group
            border border-gray-800/50 hover:border-[#4079ff]/30">
            <div className="i-ph:google-logo text-lg text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-400 text-sm group-hover:text-white transition-colors">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2 px-3 
            bg-[#2E2F33] rounded-lg hover:bg-[#3E3F43] transition-all duration-200 group
            border border-gray-800/50 hover:border-[#4079ff]/30">
            <div className="i-ph:github-logo text-lg text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-400 text-sm group-hover:text-white transition-colors">GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#1A1B1E] text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Email</label>
            <input 
              type="email"
              className="w-full bg-[#2E2F33] text-gray-300 rounded-lg pl-8 pr-3 py-2
                border border-gray-800/50 focus:border-[#4079ff]/50 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Password</label>
            <input 
              type="password"
              className="w-full bg-[#2E2F33] text-gray-300 rounded-lg pl-8 pr-3 py-2
                border border-gray-800/50 focus:border-[#4079ff]/50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] 
            py-2 rounded-lg text-white text-sm font-medium">
            Sign In
          </button>
        </div>
      </div>
    </div>,

    // Enhanced Dashboard Demo
    <div key="dashboard" className="bg-[#1A1B1E] rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Analytics Overview</h3>
        <select className="bg-[#2E2F33] text-gray-300 rounded-lg px-3 py-1.5 text-sm border border-gray-700">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#2E2F33] p-4 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">Revenue</div>
              <div className="text-[#4079ff] text-2xl font-bold">$13.4k</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#4079ff]/10 flex items-center justify-center">
              <div className="i-ph:trend-up text-[#4079ff]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="text-green-500 text-xs">+12%</div>
            <div className="text-gray-500 text-xs">vs last period</div>
          </div>
        </div>

        {/* Chart Cards */}
        <div className="bg-[#2E2F33] p-4 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-400 text-sm">Monthly Growth</div>
            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="h-24 flex items-end justify-between gap-1">
            {[30, 45, 25, 60, 75, 45, 65].map((height, i) => (
              <div key={i} className="w-full bg-blue-500/20 rounded-sm" style={{ height: `${height}%` }}>
                <div className="w-full bg-blue-500/40 rounded-sm" style={{ height: `${height * 0.7}%` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2E2F33] p-4 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-400 text-sm">Conversion Rate</div>
            <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
          </div>
          <div className="h-24 relative overflow-hidden">
            <div className="absolute inset-0 flex items-end">
              <div className="w-full h-[65%] rounded-lg bg-gradient-to-t from-purple-500/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Enhanced Chat Demo
    <div key="chat" className="bg-[#1A1B1E] rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4079ff] to-[#40ffaa]" />
        <div className="text-white font-semibold">Chat Room</div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0" />
          <div className="bg-[#2E2F33] p-3 rounded-2xl rounded-tl-sm text-gray-300 text-sm max-w-[80%]">
            Hey, how's the new feature coming along? 👋
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <div className="bg-[#4079ff] p-3 rounded-2xl rounded-tr-sm text-white text-sm max-w-[80%]">
            Making great progress! Just implementing the final touches on the UI 🚀
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
        </div>
      </div>
      <div className="mt-6 relative">
        <input 
          type="text" 
          placeholder="Type your message..."
          className="w-full bg-[#2E2F33] text-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#4079ff]/50"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#4079ff] flex items-center justify-center">
          <div className="i-ph:paper-plane-right-fill text-white" />
        </button>
      </div>
    </div>,

    // Enhanced Todo Demo
    <div key="todo" className="bg-[#1A1B1E] rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">My Tasks</h3>
        <select className="bg-[#2E2F33] text-gray-300 rounded-lg px-3 py-1.5 text-sm border border-gray-700">
          <option>All Tasks</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="space-y-3">
        {[
          { text: "Design new landing page", tag: "Design", color: "blue" },
          { text: "Implement authentication", tag: "Backend", color: "purple" },
          { text: "Update documentation", tag: "Docs", color: "green" }
        ].map((task, i) => (
          <div key={i} className="group bg-[#2E2F33] p-4 rounded-lg border border-gray-800/50 hover:border-[#4079ff]/50 transition-all cursor-move">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-gray-600 group-hover:border-[#4079ff] transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors">{task.text}</span>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs bg-${task.color}-500/20 text-${task.color}-400`}>
                {task.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 relative">
        <input 
          type="text" 
          placeholder="Add a new task..."
          className="w-full bg-[#2E2F33] text-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#4079ff]/50"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#4079ff] flex items-center justify-center">
          <div className="i-ph:plus text-white" />
        </button>
      </div>
    </div>,

    // Input Demo
    <div key="input-demo" className="relative">
      <div className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Design a profile page with bio"
          className="w-full bg-[#2E2F33] text-gray-300 rounded-lg pl-12 pr-36 py-4 
            border border-gray-800/50 focus:border-[#4079ff]/50
            focus:outline-none focus:ring-2 focus:ring-[#4079ff]/20
            transition-all duration-300"
        />
        
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 text-[#4079ff]">
            <div className="i-ph:code text-lg" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-[#4079ff] hover:text-white 
            bg-[#4079ff]/10 hover:bg-[#4079ff] rounded-md transition-colors duration-200">
            Generate
          </button>
          <div className="w-8 h-8 rounded-lg bg-[#4079ff] flex items-center justify-center 
            cursor-pointer hover:bg-[#4079ff]/80 transition-colors">
            <div className="i-ph:arrow-right text-white" />
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] rounded-full 
          bg-gradient-to-r from-[#4079ff]/0 via-[#4079ff] to-[#4079ff]/0 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Typing Animation */}
      <TypeAnimation
        sequence={[demoPrompts[demoStep]]}
        wrapper="div"
        cursor={true}
        speed={50}
        className="absolute top-1/2 left-12 -translate-y-1/2 text-gray-400 pointer-events-none"
        style={{ display: inputValue ? 'none' : 'block' }}
      />
    </div>
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % demoPrompts.length);
    }, 3000); // Change demo every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const result = await upsertUser({
              email: session.user.email!,
              name: session.user.user_metadata.full_name || session.user.email!,
              picture: session.user.user_metadata.avatar_url,
              supabaseId: session.user.id,
            });

            const userData = {
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email,
              picture: session.user.user_metadata.avatar_url,
              _id: result,
              supabaseId: session.user.id
            };

            localStorage.setItem('user', JSON.stringify(userData));

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('auth-change'));

            toast.success('Successfully logged in!');
            onSuccess();
            onClose();
            window.history.replaceState({}, '', window.location.pathname.replace(/[~/]+$/, ''));
          } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [onSuccess, onClose, location.pathname, upsertUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div className="flex w-full max-w-6xl gap-8 p-8">
        {/* Left side - Auth UI */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black p-6 rounded-3xl shadow-2xl w-1/2"
        >
          <div className="text-center mb-6">
            <div className="mb-4 flex flex-col items-center justify-center">
              <div className="relative">
                <img 
                  src="/logo-dark-styled.png" 
                  alt="DeepGen Logo" 
                  className="w-[100px] h-auto drop-shadow-2xl"
                />
                <div className="absolute -bottom-2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-80"></div>
              </div>
              <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                DeepGen
              </h1>
            </div>
            <p className="text-white text-sm font-light leading-relaxed">
              Access the future of coding with <span className="font-medium text-[#2563EB]">DeepGen</span>
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563EB',
                    brandAccent: '#1D4ED8'
                  }
                }
              }
            }}
            providers={['google', 'github']}
            theme="dark"
          />
        </motion.div>

        {/* Right side - Demo Animation */}
        <motion.div className="bg-[#040810] p-6 rounded-3xl shadow-2xl w-1/2 relative overflow-hidden">
          {/* Background Image and Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhaW4lMjBjb2xvdXJ8ZW58MHx8MHx8fDA%3D"
              alt="background"
              className="object-cover w-full h-full opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#3c5882]/50 via-[#111c32]/60 to-[#060c1c]/70" />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-full bg-gradient-to-tr from-[#324c6c]/30 via-[#1b2c4c]/30 to-[#334474]/30" />
            <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-[#283e63]/40 to-transparent rounded-full blur-[80px] -top-[200px] -right-[200px]" />
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-[#1c344e]/40 to-transparent rounded-full blur-[70px] -bottom-[200px] -left-[200px]" />
          </div>

          {/* Content Container */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6">Watch the Magic Happen</h2>
            
            <div className="relative mb-4">
              <div className="bg-[#2E2F33] rounded-lg p-4">
                <TypeAnimation
                  sequence={[
                    "Design a profile page with bio",
                    2000,
                    "Create a login and registration page with form validation",
                    2000,
                    "Generate a user dashboard with charts",
                    2000,
                    "Build a real-time chat component",
                    2000,
                    "Create a to-do list app with drag-and-drop functionality",
                    2000
                  ]}
                  wrapper="div"
                  cursor={true}
                  repeat={Infinity}
                  speed={99}
                  className="text-[#71717A]"
                />
              </div>
            </div>

            <motion.div 
              key={demoStep}
              className="flex-1 bg-[#2E2F33] rounded-lg p-4 overflow-hidden font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <TypeAnimation
                sequence={[demoCode[demoStep]]}
                wrapper="div"
                cursor={false}
                speed={20}
                className="text-[#4079ff] text-sm whitespace-pre text-left"
              />
            </motion.div>

            <motion.div 
              key={`preview-${demoStep}`}
              className="mt-4 bg-[#2E2F33] rounded-lg w-full relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Window Control Buttons */}
              <div className="absolute left-4 top-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              
              {/* Content with adjusted padding to account for buttons */}
              <div className="pt-12 p-4">
                {demoComponents[demoStep]}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}