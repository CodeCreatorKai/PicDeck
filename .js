import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Send, X, UserPlus, MessageSquare, User, Settings, Search, Plus, Play, Film, Sparkles, Grid, Trophy, ShoppingBag, ArrowLeft, Phone, VideoIcon, Info, Type, Pencil, Home, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Video, RefreshCw, Check, Loader, Award, Crown, Target, Zap } from 'lucide-react';

export default function PicDeckPlatform() {
  const [currentScreen, setCurrentScreen] = useState('signup');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [newCard, setNewCard] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeView, setActiveView] = useState('main');
  const [cameraMode, setCameraMode] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [textMode, setTextMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [showTrading, setShowTrading] = useState(false);
  const [selectedCardForTrade, setSelectedCardForTrade] = useState(null);
  const [gameActive, setGameActive] = useState(null);
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const gameIntervalRef = useRef(null);

  const filters = [
    { name: 'none', label: 'Original', style: 'none' },
    { name: 'grayscale', label: 'B&W', style: 'grayscale(100%)' },
    { name: 'sepia', label: 'Vintage', style: 'sepia(100%)' },
    { name: 'saturate', label: 'Vibrant', style: 'saturate(200%)' },
    { name: 'brightness', label: 'Bright', style: 'brightness(150%)' },
    { name: 'hue', label: 'Rainbow', style: 'hue-rotate(90deg)' },
  ];

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    birthDate: '',
    selectedDeck: '',
    password: ''
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Demo User',
    age: 20,
    picCount: 0,
    packsAvailable: 1,
    aiMode: 'full',
    selectedDeck: 'Athletes',
    collection: [],
    completionRate: 0,
    avatar: null
  });

  const [posts, setPosts] = useState([
    { 
      id: 1, 
      user: 'PicDeck', 
      avatar: '💬', 
      content: 'Welcome to PicDeck! Real people only. Start collecting cards! 🎉',
      likes: 0,
      comments: 0,
      shares: 0,
      time: 'Now',
      liked: false,
      bookmarked: false
    }
  ]);

  const [tradeOffers, setTradeOffers] = useState([
    { id: 1, user: 'CardCollector', avatar: '🎯', offering: 'Lionel Messi', wanting: 'Michael Jordan', deck: 'Athletes' },
    { id: 2, user: 'GamerPro', avatar: '🎮', offering: 'Minecraft', wanting: 'Fortnite', deck: 'Video Games' },
  ]);

  const [aiMessages, setAiMessages] = useState([]);

  // Snake Game State
  const [snakeGame, setSnakeGame] = useState({
    snake: [{x: 10, y: 10}],
    food: {x: 15, y: 15},
    direction: 'RIGHT',
    score: 0,
    gameOver: false
  });

  // Memory Match Game State
  const [memoryGame, setMemoryGame] = useState({
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    score: 0,
    gameOver: false,
    isChecking: false // Added to prevent race conditions
  });

  // Reaction Time Game State
  const [reactionGame, setReactionGame] = useState({
    waiting: true,
    ready: false,
    clicked: false,
    startTime: 0,
    reactionTime: 0,
    attempts: [],
    gameOver: false
  });

  // Number Sequence Game State
  const [sequenceGame, setSequenceGame] = useState({
    sequence: [],
    userSequence: [],
    level: 1,
    showing: false,
    gameOver: false,
    score: 0
  });

  const [leaderboards, setLeaderboards] = useState({
    snake: [
      { name: 'SnakeKing', score: 450 },
      { name: 'ProGamer', score: 380 },
      { name: 'CardMaster', score: 290 },
    ],
    memory: [
      { name: 'BrainMaster', score: 920 },
      { name: 'MemoryPro', score: 850 },
      { name: 'QuickMatch', score: 780 },
    ],
    reaction: [
      { name: 'LightningFast', score: 187 },
      { name: 'QuickDraw', score: 203 },
      { name: 'SpeedDemon', score: 225 },
    ],
    sequence: [
      { name: 'PatternKing', score: 15 },
      { name: 'SequencePro', score: 12 },
      { name: 'MemoryChamp', score: 10 },
    ]
  });

  const deckCards = {
    'Athletes': {
      iconic: [
        {name: 'Michael Jordan', image: '🏀'}, {name: 'Muhammad Ali', image: '🥊'}, 
        {name: 'Pele', image: '⚽'}
      ],
      legendary: [
        {name: 'Lionel Messi', image: '⚽'}, {name: 'Serena Williams', image: '🎾'}, 
        {name: 'Usain Bolt', image: '🏃'}, {name: 'Tom Brady', image: '🏈'}
      ],
      epic: [
        {name: 'Kobe Bryant', image: '🏀'}, {name: 'LeBron James', image: '🏀'}, 
        {name: 'Cristiano Ronaldo', image: '⚽'}, {name: 'Tiger Woods', image: '⛳'}, 
        {name: 'Roger Federer', image: '🎾'}, {name: 'Michael Phelps', image: '🏊'}
      ],
      rare: [
        {name: 'Stephen Curry', image: '🏀'}, {name: 'Kevin Durant', image: '🏀'}, 
        {name: 'Patrick Mahomes', image: '🏈'}, {name: 'Kylian Mbappe', image: '⚽'}, 
        {name: 'Erling Haaland', image: '⚽'}
      ],
      common: [
        {name: 'Josh Allen', image: '🏈'}, {name: 'Joe Burrow', image: '🏈'}, 
        {name: 'Jayson Tatum', image: '🏀'}, {name: 'Luka Doncic', image: '🏀'}, 
        {name: 'Caitlin Clark', image: '🏀'}
      ]
    },
    'Cars': {
      iconic: [
        {name: 'Bugatti La Voiture Noire', image: '🏎️'}, 
        {name: 'Ferrari 250 GTO', image: '🏎️'}
      ],
      legendary: [
        {name: 'Rolls-Royce Sweptail', image: '🚗'}, 
        {name: 'Pagani Zonda HP', image: '🏎️'}
      ],
      epic: [
        {name: 'Bugatti Chiron', image: '🏎️'}, 
        {name: 'Lamborghini Aventador', image: '🏎️'}, 
        {name: 'Ferrari LaFerrari', image: '🏎️'}
      ],
      rare: [
        {name: 'Porsche 911 GT3', image: '🏎️'}, 
        {name: 'McLaren 720S', image: '🏎️'}
      ],
      common: [
        {name: 'BMW M3', image: '🚗'}, 
        {name: 'Chevrolet Corvette C8', image: '🏎️'}
      ]
    },
    'Musicians': {
      iconic: [
        {name: 'The Beatles', image: '🎸'}, 
        {name: 'Michael Jackson', image: '🎤'}
      ],
      legendary: [
        {name: 'Elvis Presley', image: '🎤'}, 
        {name: 'Freddie Mercury', image: '🎸'}
      ],
      epic: [
        {name: 'Taylor Swift', image: '🎤'}, 
        {name: 'Beyonce', image: '🎤'}, 
        {name: 'Drake', image: '🎤'}
      ],
      rare: [
        {name: 'The Weeknd', image: '🎤'}, 
        {name: 'Ariana Grande', image: '🎤'}
      ],
      common: [
        {name: 'Morgan Wallen', image: '🎸'}, 
        {name: 'Doja Cat', image: '🎤'}
      ]
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSignUp = () => {
    if (!signUpData.name || !signUpData.email || !signUpData.birthDate || !signUpData.selectedDeck || !signUpData.password) {
      alert('Please fill in all fields!');
      return;
    }

    const code = generateVerificationCode();
    setSentCode(code);
    alert(`Verification code sent to ${signUpData.email}!\n\nYour code is: ${code}\n\n(In production, this would be sent via email)`);
    setCurrentScreen('verification');
  };

  const handleVerification = () => {
    if (verificationCode.trim() === sentCode.trim()) {
      const age = calculateAge(signUpData.birthDate);
      const newUser = {
        ...signUpData,
        age,
        aiMode: age < 19 ? 'study' : 'full',
        picCount: 0,
        packsAvailable: 1,
        collection: [],
        completionRate: 0,
        avatar: null
      };
      setUserProfile(newUser);
      setCurrentScreen('main');
      setAiMessages([{ 
        id: 1, 
        text: `Hi ${newUser.name}! I'm your ${age < 19 ? 'study' : 'personal'} AI assistant. How can I help you today?`, 
        sender: 'ai' 
      }]);
    } else {
      alert('Incorrect verification code. Please try again.');
    }
  };

  const openPack = () => {
    if (userProfile.packsAvailable > 0) {
      const deck = deckCards[userProfile.selectedDeck];
      
      const rand = Math.random() * 100;
      let rarity = 'common';
      if (rand < 0.1) rarity = 'iconic';
      else if (rand < 0.6) rarity = 'legendary';
      else if (rand < 10) rarity = 'epic';
      else if (rand < 35) rarity = 'rare';
      
      const cardsOfRarity = deck[rarity];
      const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      
      const newCardObj = {
        id: Date.now(),
        name: randomCard.name,
        image: randomCard.image,
        rarity: rarity,
        deck: userProfile.selectedDeck
      };

      setNewCard(newCardObj);
      setShowPackAnimation(true);
      
      setTimeout(() => {
        const newCollection = [...userProfile.collection, newCardObj];
        const uniqueCards = [...new Set(newCollection.map(c => c.name))];
        const totalUniqueInDeck = Object.values(deck).reduce((acc, arr) => acc + arr.length, 0);
        
        setUserProfile(prev => ({
          ...prev,
          packsAvailable: prev.packsAvailable - 1,
          collection: newCollection,
          completionRate: Math.round((uniqueCards.length / totalUniqueInDeck) * 100),
          avatar: prev.avatar || newCardObj.name
        }));
        
        setShowPackAnimation(false);
        setNewCard(null);
      }, 3000);
    }
  };

  // MOCK AI SERVICE (Replacing broken API call)
  const simulateAiResponse = async (query, mode) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const responses = {
      study: [
        "That's an interesting question! How would you approach solving it?",
        "Let's break this down. What's the first step you think we should take?",
        "Great thinking! Can you explain why you think that's the case?",
        "I can help with that. Remember the core concept we discussed? apply that here."
      ],
      full: [
        "I can certainly help with that!",
        "Here's what I found about that topic...",
        "That sounds like a fun idea. Let's explore it further.",
        "Is there anything else you'd like to know?"
      ]
    };

    // Simple keyword matching for demo purposes
    if (query.toLowerCase().includes('math')) return "Let's tackle this math problem step-by-step. What formula do you think applies here?";
    if (query.toLowerCase().includes('write')) return "I'd love to help you write that. What's the main theme you're going for?";
    
    const pool = mode === 'study' ? responses.study : responses.full;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMsg = { id: Date.now(), text: aiInput, sender: 'user' };
    setAiMessages(prev => [...prev, userMsg]);
    const query = aiInput;
    setAiInput('');
    setAiTyping(true);

    try {
      // Replaced direct API call with simulation for debugging/demo
      const aiText = await simulateAiResponse(query, userProfile.aiMode);
      
      let currentText = '';
      const words = aiText.split(' ');
      const aiMsgId = Date.now() + 1;
      
      setAiMessages(prev => [...prev, { id: aiMsgId, text: '', sender: 'ai' }]);
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        // Use functional update to ensure we are updating the correct message
        setAiMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, text: currentText } : msg
        ));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setAiTyping(false);
    } catch (error) {
      setAiTyping(false);
      setAiMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting. Please try again!", sender: 'ai' }]);
    }
  };

  // SNAKE GAME - FIXED LOOP
  const moveSnake = useCallback(() => {
    setSnakeGame(prev => {
      if (prev.gameOver) return prev;
      
      const head = {...prev.snake[0]};
      
      if (prev.direction === 'UP') head.y -= 1;
      if (prev.direction === 'DOWN') head.y += 1;
      if (prev.direction === 'LEFT') head.x -= 1;
      if (prev.direction === 'RIGHT') head.x += 1;
      
      // Wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        updateLeaderboard('snake', prev.score);
        return {...prev, gameOver: true};
      }
      
      // Self collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        updateLeaderboard('snake', prev.score);
        return {...prev, gameOver: true};
      }
      
      const newSnake = [head, ...prev.snake];
      
      // Food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newFood = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        };
        return {...prev, snake: newSnake, food: newFood, score: prev.score + 10};
      } else {
        newSnake.pop();
        return {...prev, snake: newSnake};
      }
    });
  }, []);

  useEffect(() => {
    if (gameActive === 'snake' && !snakeGame.gameOver) {
      gameIntervalRef.current = setInterval(moveSnake, 150);
      return () => clearInterval(gameIntervalRef.current);
    }
  }, [gameActive, snakeGame.gameOver, moveSnake]);

  // Fixed Snake Key Handling to prevent reversals
  useEffect(() => {
    if (gameActive === 'snake') {
      const handleKeyPress = (e) => {
        setSnakeGame(prev => {
          // Prevent 180 turns
          if (e.key === 'ArrowUp' && prev.direction !== 'DOWN') return {...prev, direction: 'UP'};
          if (e.key === 'ArrowDown' && prev.direction !== 'UP') return {...prev, direction: 'DOWN'};
          if (e.key === 'ArrowLeft' && prev.direction !== 'RIGHT') return {...prev, direction: 'LEFT'};
          if (e.key === 'ArrowRight' && prev.direction !== 'LEFT') return {...prev, direction: 'RIGHT'};
          return prev;
        });
      };
      
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameActive]);

  const resetSnakeGame = () => {
    setSnakeGame({
      snake: [{x: 10, y: 10}],
      food: {x: 15, y: 15},
      direction: 'RIGHT',
      score: 0,
      gameOver: false
    });
  };

  // MEMORY MATCH GAME - FIXED RACE CONDITION
  const initMemoryGame = () => {
    const emojis = ['🏀', '⚽', '🏈', '🎾', '⚾', '🏐', '🎱', '🏓'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false
    }));
    
    setMemoryGame({
      cards,
      flipped: [],
      matched: [],
      moves: 0,
      score: 1000,
      gameOver: false,
      isChecking: false
    });
  };

  const flipCard = (id) => {
    // Add check for isChecking to prevent clicking > 2 cards
    if (memoryGame.isChecking || memoryGame.matched.includes(id) || memoryGame.flipped.includes(id)) return;
    
    const newFlipped = [...memoryGame.flipped, id];
    setMemoryGame(prev => ({ ...prev, flipped: newFlipped }));
    
    if (newFlipped.length === 2) {
      setMemoryGame(prev => ({ ...prev, isChecking: true })); // Lock input
      
      const card1 = memoryGame.cards.find(c => c.id === newFlipped[0]);
      const card2 = memoryGame.cards.find(c => c.id === newFlipped[1]);
      
      setTimeout(() => {
        if (card1.emoji === card2.emoji) {
          const newMatched = [...memoryGame.matched, ...newFlipped];
          const newScore = memoryGame.score + 50;
          setMemoryGame(prev => ({
            ...prev,
            matched: newMatched,
            flipped: [],
            moves: prev.moves + 1,
            score: newScore,
            gameOver: newMatched.length === memoryGame.cards.length,
            isChecking: false // Unlock
          }));
          
          if (newMatched.length === memoryGame.cards.length) {
            updateLeaderboard('memory', newScore);
          }
        } else {
          setMemoryGame(prev => ({
            ...prev,
            flipped: [],
            moves: prev.moves + 1,
            score: Math.max(0, prev.score - 10),
            isChecking: false // Unlock
          }));
        }
      }, 800);
    }
  };

  // REACTION TIME GAME
  const startReactionGame = () => {
    setReactionGame({
      waiting: true,
      ready: false,
      clicked: false,
      startTime: 0,
      reactionTime: 0,
      attempts: [],
      gameOver: false
    });
    
    const delay = Math.random() * 2000 + 1000; // Reduced max wait for better UX
    setTimeout(() => {
      setReactionGame(prev => {
        if(prev.gameOver || !prev.waiting) return prev; // Safety check if game exited
        return {
          ...prev,
          waiting: false,
          ready: true,
          startTime: Date.now()
        };
      });
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionGame.waiting) {
      alert('Too early! Wait for green!');
      startReactionGame();
      return;
    }
    
    if (reactionGame.ready && !reactionGame.clicked) {
      const time = Date.now() - reactionGame.startTime;
      const newAttempts = [...reactionGame.attempts, time];
      
      setReactionGame(prev => ({
        ...prev,
        clicked: true,
        reactionTime: time,
        attempts: newAttempts,
        gameOver: newAttempts.length >= 5
      }));
      
      if (newAttempts.length >= 5) {
        const avgTime = Math.round(newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length);
        updateLeaderboard('reaction', avgTime);
      }
    }
  };

  // NUMBER SEQUENCE GAME
  const startSequenceGame = () => {
    const newSequence = [Math.floor(Math.random() * 9) + 1];
    setSequenceGame({
      sequence: newSequence,
      userSequence: [],
      level: 1,
      showing: true,
      gameOver: false,
      score: 0
    });
    
    setTimeout(() => {
      setSequenceGame(prev => ({ ...prev, showing: false }));
    }, 1000);
  };

  const addToSequence = (num) => {
    if (sequenceGame.showing || sequenceGame.gameOver) return;
    
    const newUserSeq = [...sequenceGame.userSequence, num];
    
    if (newUserSeq[newUserSeq.length - 1] !== sequenceGame.sequence[newUserSeq.length - 1]) {
      updateLeaderboard('sequence', sequenceGame.level - 1);
      setSequenceGame(prev => ({ ...prev, gameOver: true, score: prev.level - 1 }));
      return;
    }
    
    if (newUserSeq.length === sequenceGame.sequence.length) {
      const nextLevel = sequenceGame.level + 1;
      const newSequence = [...sequenceGame.sequence, Math.floor(Math.random() * 9) + 1];
      
      setSequenceGame(prev => ({
        ...prev,
        sequence: newSequence,
        userSequence: [],
        level: nextLevel,
        showing: true,
        score: nextLevel
      }));
      
      setTimeout(() => {
        setSequenceGame(prev => ({ ...prev, showing: false }));
      }, 1000 + (nextLevel * 100));
    } else {
      setSequenceGame(prev => ({ ...prev, userSequence: newUserSeq }));
    }
  };

  // LEADERBOARD UPDATE
  const updateLeaderboard = (game, score) => {
    setLeaderboards(prev => {
      const currentBoard = [...prev[game]];
      const existingIndex = currentBoard.findIndex(entry => entry.name === userProfile.name);
      
      if (existingIndex !== -1) {
        const currentBest = currentBoard[existingIndex].score;
        const isHigherBetter = game !== 'reaction';
        const shouldUpdate = isHigherBetter ? score > currentBest : score < currentBest;
        
        if (shouldUpdate) {
          currentBoard[existingIndex].score = score;
        }
      } else {
        currentBoard.push({ name: userProfile.name, score });
      }
      
      currentBoard.sort((a, b) => game === 'reaction' ? a.score - b.score : b.score - a.score);
      
      return { ...prev, [game]: currentBoard.slice(0, 10) };
    });
  };

  const startCamera = async (mode) => {
    setCameraMode(mode);
    setActiveView('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      alert('Camera access denied or not available');
      setActiveView('main'); // Fallback
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null; // Clear ref
    }
    setCameraMode(null);
    setCapturedMedia(null);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Apply Filter logic
      const filterObj = filters.find(f => f.name === currentFilter);
      ctx.filter = filterObj ? filterObj.style : 'none';
      
      ctx.drawImage(video, 0, 0);
      setCapturedMedia(canvas.toDataURL('image/png'));
    }
  };

  const addText = () => {
    if (!capturedMedia || !editText) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.font = '48px Arial';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(editText, canvas.width / 2, canvas.height / 2);
      setCapturedMedia(canvas.toDataURL('image/png'));
      setEditText('');
      setTextMode(false);
    };
    img.src = capturedMedia;
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getRarityColor = (rarity) => {
    const colors = {
      iconic: 'from-amber-300 via-yellow-400 to-amber-500',
      legendary: 'from-yellow-400 to-orange-500',
      epic: 'from-purple-400 to-pink-500',
      rare: 'from-blue-400 to-cyan-500',
      common: 'from-slate-300 to-slate-400'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityEmoji = (rarity) => {
    const emojis = { iconic: '⭐', legendary: '👑', epic: '💎', rare: '⭐', common: '🎯' };
    return emojis[rarity] || '🎯';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  // SIGNUP SCREEN
  if (currentScreen === 'signup') {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">💬</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">PicDeck</h1>
            <p className="text-slate-600 mt-2">One account. Real humans only.</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={signUpData.name}
              onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="Full Name"
            />

            <input
              type="email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="Email"
            />

            <input
              type="date"
              value={signUpData.birthDate}
              onChange={(e) => setSignUpData({...signUpData, birthDate: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-indigo-400 focus:outline-none transition-all"
            />
            {signUpData.birthDate && (
              <p className="text-xs text-indigo-600">
                AI: {calculateAge(signUpData.birthDate) < 19 ? '📚 Study Mode' : '✨ Full Access'}
              </p>
            )}

            <select
              value={signUpData.selectedDeck}
              onChange={(e) => setSignUpData({...signUpData, selectedDeck: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-indigo-400 focus:outline-none transition-all"
            >
              <option value="">Choose Collection Deck</option>
              <option value="Athletes">🏆 Athletes</option>
              <option value="Cars">🏎️ Cars</option>
              <option value="Musicians">🎵 Musicians</option>
            </select>

            <input
              type="password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 focus:border-indigo-400 focus:outline-none transition-all"
              placeholder="Password"
            />

            <button
              onClick={handleSignUp}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Create Account
            </button>

            <p className="text-xs text-center text-slate-500">
              🔒 Email verification required • No bots allowed
            </p>
          </div>
        </div>
      </div>
    );
  }

  // VERIFICATION SCREEN
  if (currentScreen === 'verification') {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📧</div>
            <h1 className="text-2xl font-bold text-slate-800">Verify Your Email</h1>
            <p className="text-slate-600 mt-2">Enter the 6-digit code sent to</p>
            <p className="text-indigo-600 font-semibold">{signUpData.email}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-indigo-800 mb-2">Your Verification Code:</p>
              <p className="text-3xl font-bold text-indigo-600 text-center tracking-wider">{sentCode}</p>
            </div>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-4 rounded-xl border-2 focus:border-indigo-400 focus:outline-none text-center text-2xl font-bold tracking-widest transition-all"
              placeholder="000000"
            />

            <button
              onClick={handleVerification}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all active:scale-95"
            >
              Verify & Continue
            </button>

            <button
              onClick={() => {
                const code = generateVerificationCode();
                setSentCode(code);
                alert(`Your new code is: ${code}`);
              }}
              className="w-full py-3 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-all"
            >
              Resend Code
            </button>

            <button
              onClick={() => setCurrentScreen('signup')}
              className="w-full py-3 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pack Opening Animation
  if (showPackAnimation && newCard) {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              ✨
            </div>
          ))}
        </div>

        <div className="relative z-10 animate-bounce">
          <div className={`bg-gradient-to-br ${getRarityColor(newCard.rarity)} rounded-3xl p-8 shadow-2xl transform hover:scale-110 transition-all`}>
            <div className="text-center">
              <div className="text-8xl mb-4 animate-pulse">{newCard.image}</div>
              <div className="text-6xl mb-4">{getRarityEmoji(newCard.rarity)}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{newCard.name}</h2>
              <p className="text-white opacity-90 uppercase text-sm font-bold">{newCard.rarity}</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-white text-2xl font-bold animate-pulse">
              {newCard.rarity === 'iconic' ? '🌟 ICONIC! 🌟' : 'New Card!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Camera View
  if (activeView === 'camera') {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-black relative">
        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${capturedMedia ? 'hidden' : ''}`} style={{ filter: filters.find(f => f.name === currentFilter)?.style || 'none' }} />
        {capturedMedia && <img src={capturedMedia} alt="Captured" className="w-full h-full object-cover" />}
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute top-4 left-4 z-10">
          <button onClick={() => { stopCamera(); setActiveView('main'); }} className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {!capturedMedia && (
          <>
            <div className="absolute top-4 right-4 flex gap-2 overflow-x-auto max-w-[60%]">
              {filters.map(filter => (
                <button
                  key={filter.name}
                  onClick={() => setCurrentFilter(filter.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${currentFilter === filter.name ? 'bg-indigo-600 text-white scale-110' : 'bg-white bg-opacity-50 text-white'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-indigo-400 hover:scale-110 active:scale-95 transition-transform" />
            </div>
          </>
        )}

        {capturedMedia && (
          <>
            <div className="absolute top-16 left-4 right-4 flex gap-2">
              <button onClick={() => setTextMode(!textMode)} className="px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm text-white flex items-center gap-2 hover:bg-opacity-30 transition-all">
                <Type className="w-4 h-4" />
                Text
              </button>
            </div>

            {textMode && (
              <div className="absolute top-28 left-4 right-4 space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-90"
                />
                <div className="flex gap-2">
                  {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${textColor === color ? 'border-indigo-600 scale-110' : 'border-white'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button onClick={addText} className="px-4 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-all">
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6">
              <button onClick={() => setCapturedMedia(null)} className="px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all">
                Retake
              </button>
              <button 
                onClick={() => {
                  stopCamera();
                  setActiveView('main');
                  setUserProfile(prev => {
                    const newPicCount = prev.picCount + 1;
                    return {
                      ...prev,
                      picCount: newPicCount >= 50 ? 0 : newPicCount,
                      packsAvailable: newPicCount >= 50 ? prev.packsAvailable + 1 : prev.packsAvailable
                    };
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Send className="w-5 h-5" />
                Post
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Trading Plaza
  if (showTrading) {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-slate-50 flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
          <button onClick={() => setShowTrading(false)} className="hover:scale-110 transition-transform">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Trading Plaza</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              Create Trade Offer
            </h3>
            {selectedCardForTrade ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold">{selectedCardForTrade.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{selectedCardForTrade.rarity}</p>
                  </div>
                  <button onClick={() => setSelectedCardForTrade(null)} className="text-red-500 text-sm font-semibold hover:text-red-700 transition-colors">
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="What card do you want?"
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all">
                  Post Trade Offer
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Select a card from your collection to trade
              </p>
            )}
          </div>

          <h3 className="font-bold text-lg">Active Trades</h3>
          {tradeOffers.map(offer => (
            <div key={offer.id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                  {offer.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm">{offer.user}</p>
                  <p className="text-xs text-slate-500">{offer.deck}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Offering</p>
                  <p className="font-semibold text-sm">{offer.offering}</p>
                </div>
                <RefreshCw className="w-5 h-5 text-indigo-600" />
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Wanting</p>
                  <p className="font-semibold text-sm">{offer.wanting}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 hover:scale-105 transition-all">
                Accept Trade
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LEADERBOARDS VIEW
  if (showLeaderboards) {
    return (
      <div className="w-full h-screen max-w-md mx-auto bg-slate-50 flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
          <button onClick={() => setShowLeaderboards(false)} className="hover:scale-110 transition-transform">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Trophy className="w-6 h-6 text-yellow-300" />
          <h1 className="text-xl font-bold text-white">Leaderboards</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Weekly Rewards
            </h3>
            <p className="text-sm opacity-90">Top 3 players in each game get FREE packs every week!</p>
            <div className="mt-2 flex gap-2">
              <div className="flex-1 bg-white bg-opacity-20 rounded-xl p-2 text-center">
                <p className="text-2xl font-bold">🥇</p>
                <p className="text-xs">3 Packs</p>
              </div>
              <div className="flex-1 bg-white bg-opacity-20 rounded-xl p-2 text-center">
                <p className="text-2xl font-bold">🥈</p>
                <p className="text-xs">2 Packs</p>
              </div>
              <div className="flex-1 bg-white bg-opacity-20 rounded-xl p-2 text-center">
                <p className="text-2xl font-bold">🥉</p>
                <p className="text-xs">1 Pack</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold mb-3 text-green-600">🐍 Snake - High Score</h3>
            <div className="space-y-2">
              {leaderboards.snake.map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${entry.name === userProfile.name ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}`}>
                      {i < 3 ? '' : `#${i + 1}`}
                    </span>
                    <p className="font-semibold text-sm">{entry.name}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold mb-3 text-purple-600">🎴 Memory Match - High Score</h3>
            <div className="space-y-2">
              {leaderboards.memory.map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${entry.name === userProfile.name ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}`}>
                      {i < 3 ? '' : `#${i + 1}`}
                    </span>
                    <p className="font-semibold text-sm">{entry.name}</p>
                  </div>
                  <span className="text-sm font-bold text-purple-600">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold mb-3 text-yellow-600">⚡ Reaction Time - Fastest Avg</h3>
            <div className="space-y-2">
              {leaderboards.reaction.map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${entry.name === userProfile.name ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}`}>
                      {i < 3 ? '' : `#${i + 1}`}
                    </span>
                    <p className="font-semibold text-sm">{entry.name}</p>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{entry.score}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h3 className="font-bold mb-3 text-blue-600">🔢 Number Sequence - Longest</h3>
            <div className="space-y-2">
              {leaderboards.sequence.map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${entry.name === userProfile.name ? 'bg-indigo-100 border-2 border-indigo-400' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}`}>
                      {i < 3 ? '' : `#${i + 1}`}
                    </span>
                    <p className="font-semibold text-sm">{entry.name}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600">Level {entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="w-full h-screen max-w-md mx-auto bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-2xl">💬</div>
          <h1 className="text-xl font-bold text-white">PicDeck</h1>
        </div>
        <div className="flex gap-2">
          <div className="text-white text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
            📸 {userProfile.picCount}/50
          </div>
          <div className="text-white text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
            📦 {userProfile.packsAvailable}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            <button onClick={() => startCamera('story')} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all">
              <Camera className="w-5 h-5" />
              Create Story
            </button>

            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-md">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{post.user}</p>
                      <p className="text-xs text-slate-500">{post.time}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-slate-800">{post.content}</p>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 hover:scale-110 transition-transform">
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    <span className="text-sm font-semibold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-semibold">{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'games' && !gameActive && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Game Station</h2>
              <button 
                onClick={() => setShowLeaderboards(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all"
              >
                <Trophy className="w-5 h-5" />
                Leaderboards
              </button>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white mb-4">
              <p className="text-sm font-semibold">🏆 Top 3 players win FREE packs every week!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => { resetSnakeGame(); setGameActive('snake'); }}>
                <div className="text-4xl mb-2">🐍</div>
                <h3 className="font-bold text-white text-lg">Snake</h3>
                <p className="text-green-100 text-xs">Eat & grow!</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-4 shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => { initMemoryGame(); setGameActive('memory'); }}>
                <div className="text-4xl mb-2">🎴</div>
                <h3 className="font-bold text-white text-lg">Memory</h3>
                <p className="text-purple-100 text-xs">Match pairs!</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => { startReactionGame(); setGameActive('reaction'); }}>
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-white text-lg">Reaction</h3>
                <p className="text-yellow-100 text-xs">How fast?</p>
              </div>

              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => { startSequenceGame(); setGameActive('sequence'); }}>
                <div className="text-4xl mb-2">🔢</div>
                <h3 className="font-bold text-white text-lg">Sequence</h3>
                <p className="text-blue-100 text-xs">Memorize it!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && gameActive === 'snake' && (
          <div className="p-4">
            <div className="bg-black rounded-2xl p-6">
              <div className="flex justify-between mb-4 text-white">
                <span className="font-bold">Score: {snakeGame.score}</span>
                <button onClick={() => setGameActive(null)} className="text-red-500 font-bold hover:text-red-400">Exit</button>
              </div>
              
              {snakeGame.gameOver ? (
                <div className="bg-slate-800 rounded-xl p-8 text-center">
                  <p className="text-white text-2xl font-bold mb-4">Game Over!</p>
                  <p className="text-white text-lg mb-4">Score: {snakeGame.score}</p>
                  <button 
                    onClick={() => { resetSnakeGame(); }}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-slate-800 rounded-xl p-2 mb-4 mx-auto" style={{width: '100%', maxWidth: '400px', aspectRatio: '1'}}>
                    <div className="relative w-full h-full">
                      {snakeGame.snake.map((segment, i) => (
                        <div
                          key={i}
                          className="absolute bg-green-500 rounded-sm"
                          style={{
                            width: '5%',
                            height: '5%',
                            left: `${segment.x * 5}%`,
                            top: `${segment.y * 5}%`,
                          }}
                        />
                      ))}
                      <div
                        className="absolute bg-red-500 rounded-full"
                        style={{
                          width: '5%',
                          height: '5%',
                          left: `${snakeGame.food.x * 5}%`,
                          top: `${snakeGame.food.y * 5}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-white text-center text-sm">
                    <p>Use Arrow Keys to move</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'games' && gameActive === 'memory' && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6">
              <div className="flex justify-between mb-4 text-white">
                <span className="font-bold">Score: {memoryGame.score}</span>
                <span className="font-bold">Moves: {memoryGame.moves}</span>
                <button onClick={() => setGameActive(null)} className="text-red-300 font-bold">Exit</button>
              </div>

              {memoryGame.gameOver ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-2xl font-bold mb-4">🎉 You Won!</p>
                  <p className="text-lg mb-2">Score: {memoryGame.score}</p>
                  <p className="text-sm text-slate-600 mb-4">Moves: {memoryGame.moves}</p>
                  <button 
                    onClick={() => { initMemoryGame(); }}
                    className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {memoryGame.cards.map(card => (
                    <button
                      key={card.id}
                      onClick={() => flipCard(card.id)}
                      className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all ${
                        memoryGame.flipped.includes(card.id) || memoryGame.matched.includes(card.id)
                          ? 'bg-white'
                          : 'bg-purple-400 hover:bg-purple-300'
                      }`}
                    >
                      {(memoryGame.flipped.includes(card.id) || memoryGame.matched.includes(card.id)) ? card.emoji : '?'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'games' && gameActive === 'reaction' && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6">
              <div className="flex justify-between mb-4 text-white">
                <span className="font-bold">Attempt {reactionGame.attempts.length}/5</span>
                <button onClick={() => setGameActive(null)} className="text-red-300 font-bold">Exit</button>
              </div>

              {reactionGame.gameOver ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-2xl font-bold mb-4">⚡ Complete!</p>
                  <p className="text-lg mb-2">Average: {Math.round(reactionGame.attempts.reduce((a, b) => a + b, 0) / reactionGame.attempts.length)}ms</p>
                  <div className="space-y-1 mb-4">
                    {reactionGame.attempts.map((time, i) => (
                      <p key={i} className="text-sm text-slate-600">Try {i + 1}: {time}ms</p>
                    ))}
                  </div>
                  <button 
                    onClick={() => startReactionGame()}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : reactionGame.clicked ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-4xl font-bold text-green-500 mb-4">{reactionGame.reactionTime}ms</p>
                  <p className="text-slate-600 mb-4">Attempt {reactionGame.attempts.length}/5</p>
                  <button 
                    onClick={() => startReactionGame()}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Next
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleReactionClick}
                  className={`w-full aspect-square rounded-2xl text-white font-bold text-2xl transition-all ${
                    reactionGame.waiting ? 'bg-red-500' : 'bg-green-500'
                  }`}
                >
                  {reactionGame.waiting ? 'Wait...' : 'CLICK NOW!'}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'games' && gameActive === 'sequence' && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6">
              <div className="flex justify-between mb-4 text-white">
                <span className="font-bold">Level {sequenceGame.level}</span>
                <button onClick={() => setGameActive(null)} className="text-red-300 font-bold">Exit</button>
              </div>

              {sequenceGame.gameOver ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-2xl font-bold mb-4">🧠 Game Over!</p>
                  <p className="text-lg mb-4">You reached Level {sequenceGame.score}</p>
                  <button 
                    onClick={() => startSequenceGame()}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl p-4 mb-4 min-h-[60px] flex items-center justify-center">
                    {sequenceGame.showing ? (
                      <div className="flex gap-2">
                        {sequenceGame.sequence.map((num, i) => (
                          <span key={i} className="text-3xl font-bold text-blue-600">{num}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">Enter the sequence...</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button
                        key={num}
                        onClick={() => addToSequence(num)}
                        disabled={sequenceGame.showing}
                        className="aspect-square bg-white rounded-xl text-3xl font-bold text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-all"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">My Collection</h2>
              <p className="text-sm opacity-90">Deck: {userProfile.selectedDeck}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold">{userProfile.completionRate}%</p>
                  <p className="text-xs opacity-90">{userProfile.collection.length} cards</p>
                </div>
                <button 
                  onClick={openPack}
                  disabled={userProfile.packsAvailable === 0}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:scale-105 disabled:opacity-50 transition-all"
                >
                  Open Pack ({userProfile.packsAvailable})
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-800">
                💡 Send {50 - userProfile.picCount} more pics for next pack!
              </p>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(userProfile.picCount / 50) * 100}%`}}></div>
              </div>
            </div>

            <button 
              onClick={() => setShowTrading(true)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Trading Plaza
            </button>

            <div>
              <h3 className="font-bold text-lg mb-3">Your Cards</h3>
              {userProfile.collection.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>Open your first pack!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {userProfile.collection.map(card => (
                    <div 
                      key={card.id} 
                      onClick={() => setSelectedCardForTrade(card)}
                      className={`bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-xl p-3 shadow-md cursor-pointer hover:scale-110 transition-transform`}
                    >
                      <div className="text-2xl mb-2">{card.image}</div>
                      <h4 className="font-bold text-xs text-white">{card.name}</h4>
                      <p className="text-xs text-white opacity-75">{card.rarity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-bold mb-3">Rarity Guide</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <span className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="text-sm font-semibold">Iconic</span>
                  </span>
                  <span className="text-xs font-bold">0.1%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span>👑</span>
                    <span className="text-sm font-semibold">Legendary</span>
                  </span>
                  <span className="text-xs font-bold">0.5%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span>💎</span>
                    <span className="text-sm font-semibold">Epic</span>
                  </span>
                  <span className="text-xs font-bold">9.4%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="text-sm font-semibold">Rare</span>
                  </span>
                  <span className="text-xs font-bold">25%</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
                  <span className="flex items-center gap-2">
                    <span>🎯</span>
                    <span className="text-sm font-semibold">Common</span>
                  </span>
                  <span className="text-xs font-bold">65%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-white" />
                <div>
                  <h2 className="font-bold text-white">AI Assistant</h2>
                  <p className="text-xs text-indigo-200">
                    {userProfile.aiMode === 'study' ? '📚 Study Tutor - Helps You Learn' : '✨ Full Access'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 shadow-md'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl shadow-md flex items-center gap-2">
                    <Loader className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-slate-600 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !aiTyping && sendAiMessage()}
                disabled={aiTyping}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 focus:outline-none"
              />
              <button 
                onClick={sendAiMessage} 
                disabled={aiTyping}
                className="bg-indigo-600 text-white px-6 rounded-xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t p-2 flex justify-around fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => setActiveTab('games')} className={`flex flex-col items-center p-2 ${activeTab === 'games' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Play className="w-6 h-6" />
          <span className="text-xs">Games</span>
        </button>
        <button onClick={() => setActiveTab('collection')} className={`flex flex-col items-center p-2 ${activeTab === 'collection' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Grid className="w-6 h-6" />
          <span className="text-xs">Cards</span>
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center p-2 ${activeTab === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Sparkles className="w-6 h-6" />
          <span className="text-xs">AI</span>
        </button>
      </div>
    </div>
  );
}
