
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { GameStatus, GameState, MathProblem } from './types';
import { problems, INTRO_NARRATIVE, GAME_WIN_NARRATIVE, GAME_OVER_NARRATIVE } from './constants';
import { generateImage } from './services/imagenService';
import LoadingSpinner from './components/LoadingSpinner';
import ChoiceButton from './components/ChoiceButton';

const initialGameState: GameState = {
  currentProblemIndex: -1, // -1은 소개 화면 또는 게임 시작 전을 의미
  currentProblem: null,
  currentImageUrl: null,
  userInput: '',
  isHintVisible: false,
  isLoadingImage: false,
  attempts: 0,
};

// 이미지 표시 컴포넌트
const SceneImageDisplay: React.FC<{ imageUrl: string | null; isLoading: boolean; altText: string }> = ({ imageUrl, isLoading, altText }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 md:h-96 bg-slate-700 rounded-lg flex flex-col items-center justify-center shadow-lg animate-pulse">
        <LoadingSpinner />
        <p className="ml-4 text-slate-300 mt-3">박물관 전시물을 만들고 있어요...</p>
      </div>
    );
  }
  if (!imageUrl) {
    return (
      <div className="w-full h-64 md:h-96 bg-slate-700/50 border-2 border-slate-600 rounded-lg flex items-center justify-center shadow-lg">
        <p className="text-slate-400 text-center p-4">이 장면에 대한 이미지가 없어요. 상상의 나래를 펼쳐보세요!</p>
      </div>
    );
  }
  return (
    <img 
      src={imageUrl} 
      alt={altText} 
      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl border-2 border-slate-500 transition-opacity duration-500 ease-in-out opacity-100" 
    />
  );
};


const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WELCOME);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dynamicNarrative, setDynamicNarrative] = useState<string>(""); // 성공/실패 메시지용

  useEffect(() => {
    if (!process.env.API_KEY) {
      setGameStatus(GameStatus.API_KEY_MISSING);
      setErrorMessage("API_KEY가 설정되지 않았습니다. 이미지 생성을 위해 API_KEY 환경 변수를 설정해주세요.");
    }
  }, []);

  const loadProblem = useCallback(async (problemIndex: number) => {
    if (problemIndex >= problems.length) {
      setGameStatus(GameStatus.GAME_WON); 
      setDynamicNarrative(GAME_WIN_NARRATIVE(problems[problems.length-1].successNarrative));
      return;
    }

    const problem = problems[problemIndex];
    setGameStatus(GameStatus.LOADING_PROBLEM);
    setGameState(prev => ({
      ...prev,
      currentProblemIndex: problemIndex,
      currentProblem: problem,
      userInput: '',
      isHintVisible: false,
      isLoadingImage: true,
      currentImageUrl: null, 
    }));
    setErrorMessage(null);
    setDynamicNarrative(""); 

    try {
      const imageUrl = await generateImage(problem.imagePromptSuggestion);
      setGameState(prev => ({ ...prev, currentImageUrl: imageUrl, isLoadingImage: false }));
      setGameStatus(GameStatus.PROBLEM_READY);
    } catch (error) {
      console.error("문제 이미지 로딩 오류:", error);
      setErrorMessage(error instanceof Error ? error.message : "이미지를 불러오는데 실패했어요.");
      setGameState(prev => ({ ...prev, isLoadingImage: false, currentImageUrl: null }));
      setGameStatus(GameStatus.PROBLEM_READY); 
    }
  }, []);

  const handleStartGame = () => {
    setGameState(initialGameState);
    loadProblem(0);
  };

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!gameState.currentProblem || gameStatus !== GameStatus.PROBLEM_READY) return;

    setGameStatus(GameStatus.CHECKING_ANSWER);
    const isCorrect = gameState.userInput.trim().toLowerCase() === gameState.currentProblem.answer.toLowerCase();

    // Simulate checking delay for UX
    setTimeout(() => {
      if (isCorrect) {
        setDynamicNarrative(gameState.currentProblem!.successNarrative); // currentProblem is guaranteed here
        const nextProblemIndex = gameState.currentProblemIndex + 1;
        if (nextProblemIndex < problems.length) {
          // Short delay to show success narrative before loading next
          setTimeout(() => loadProblem(nextProblemIndex), 2000); 
        } else {
          setGameStatus(GameStatus.GAME_WON);
          setDynamicNarrative(GAME_WIN_NARRATIVE(gameState.currentProblem!.successNarrative));
        }
      } else {
        setGameStatus(GameStatus.GAME_OVER_RESTART);
        setDynamicNarrative(GAME_OVER_NARRATIVE);
      }
    }, 1000); // 1 second delay for checking
  };

  const handleRestartGame = () => {
    setGameStatus(GameStatus.WELCOME);
    setGameState(initialGameState);
    setErrorMessage(null);
    setDynamicNarrative("");
  };

  const toggleHint = () => {
    setGameState(prev => ({ ...prev, isHintVisible: !prev.isHintVisible }));
  };
  
  // isLoading is true if problem setup is happening or image is loading for the current problem
  const isLoadingProblemSetup = gameStatus === GameStatus.LOADING_PROBLEM || gameState.isLoadingImage;
  // isUiLocked is true if any background process is active that should prevent user interaction
  const isUiLocked = isLoadingProblemSetup || gameStatus === GameStatus.CHECKING_ANSWER;


  if (gameStatus === GameStatus.API_KEY_MISSING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-900 text-center">
        <h1 className="text-4xl font-bold text-yellow-300 mb-4 font-display">설정 오류</h1>
        <p className="text-xl text-slate-100">{errorMessage}</p>
        <p className="text-md text-slate-300 mt-2">이 앱은 이미지 생성을 위해 API_KEY가 필요합니다. 설정해주세요.</p>
      </div>
    );
  }

  if (gameStatus === GameStatus.WELCOME) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl text-center backdrop-blur-md bg-opacity-70 border border-slate-700">
          <h1 className="text-5xl font-bold text-sky-400 mb-6 font-display">박물관 탈출!</h1>
          <p className="text-slate-200 text-lg mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: INTRO_NARRATIVE }}></p>
          <ChoiceButton text="도전 시작!" onClick={handleStartGame} className="bg-green-600 hover:bg-green-500 text-xl px-8 py-4" />
        </div>
        <footer className="text-center text-slate-500 mt-12 text-sm">
          <p>이미지는 Imagen API로 생성됩니다. API_KEY를 설정해주세요.</p>
        </footer>
      </div>
    );
  }

  if (gameStatus === GameStatus.GAME_WON || gameStatus === GameStatus.GAME_OVER_RESTART) {
    const isWin = gameStatus === GameStatus.GAME_WON;
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isWin ? 'bg-gradient-to-br from-green-800 to-emerald-900' : 'bg-gradient-to-br from-red-800 to-rose-900'}`}>
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl text-center backdrop-blur-md bg-opacity-70 border border-slate-700">
          <h1 className={`text-4xl font-bold mb-6 font-display ${isWin ? 'text-yellow-400' : 'text-orange-400'}`}>
            {isWin ? "탈출 성공!" : "도전 초기화!"}
          </h1>
          {gameState.currentImageUrl && !isWin && (
             <img src={gameState.currentImageUrl} alt="마지막 장면" className="w-full max-w-md mx-auto h-auto object-cover rounded-lg shadow-lg mb-6 border-2 border-slate-600"/>
          )}
           {gameState.currentProblem && isWin && gameState.currentImageUrl && ( 
             <img src={gameState.currentImageUrl} alt={gameState.currentProblem.stageTitle} className="w-full max-w-md mx-auto h-auto object-cover rounded-lg shadow-lg mb-6 border-2 border-slate-600"/>
          )}
          <p className="text-slate-200 text-lg mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: dynamicNarrative }}></p>
          <ChoiceButton text="다시 플레이?" onClick={handleRestartGame} className={`${isWin ? 'bg-sky-600 hover:bg-sky-500' : 'bg-orange-600 hover:bg-orange-500'} text-xl px-8 py-4`} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-300 font-display">
          {gameState.currentProblem?.stageTitle || "박물관 탈출"}
        </h1>
        {gameState.currentProblem && <p className="text-slate-400">도전 {gameState.currentProblemIndex + 1} / {problems.length}</p>}
      </header>

      {errorMessage && (
        <div className="bg-red-700 border border-red-500 text-red-100 px-4 py-3 rounded-lg relative mb-6 shadow-lg" role="alert">
          <strong className="font-bold">오류!</strong> <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}

      {isLoadingProblemSetup && !gameState.currentProblem?.narrativeContext && ( // Use isLoadingProblemSetup here
        <div className="flex-grow flex flex-col items-center justify-center">
          <LoadingSpinner size="w-16 h-16" />
          <p className="mt-4 text-xl text-slate-300">다음 전시관을 준비 중입니다...</p>
        </div>
      )}

      {gameState.currentProblem && (
        <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="md:sticky md:top-8">
            <SceneImageDisplay 
                imageUrl={gameState.currentImageUrl} 
                isLoading={gameState.isLoadingImage} 
                altText={gameState.currentProblem.stageTitle}
            />
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-60 border border-slate-700">
            {gameStatus === GameStatus.LOADING_PROBLEM && !gameState.currentProblem.narrativeContext && (
                 <div className="flex items-center justify-center h-40"><LoadingSpinner /> <p className="ml-3 text-slate-300">세부 정보 로딩 중...</p></div>
            )}
            
            {/* Show success narrative immediately after correct answer, before next problem loads */}
            {dynamicNarrative && gameStatus === GameStatus.CHECKING_ANSWER && gameState.userInput.trim().toLowerCase() === gameState.currentProblem.answer.toLowerCase() && ( 
                <div className="mb-4 p-4 bg-green-700/30 border border-green-500 rounded-md text-green-200 font-semibold"  dangerouslySetInnerHTML={{ __html: dynamicNarrative }}></div>
            )}

            <p className="text-slate-200 text-lg leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: gameState.currentProblem.narrativeContext }}></p>
            
            <p className="text-2xl font-semibold text-yellow-400 mb-6 font-display text-center bg-slate-700/50 p-3 rounded-md">
              {gameState.currentProblem.questionMath}
            </p>

            {gameStatus === GameStatus.PROBLEM_READY && (
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <label htmlFor="answer-input" className="block text-sm font-medium text-slate-300 mb-1">정답:</label>
                  <input
                    id="answer-input"
                    type="text" 
                    value={gameState.userInput}
                    onChange={(e) => setGameState(prev => ({ ...prev, userInput: e.target.value }))}
                    className="mt-1 block w-full px-4 py-3 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-lg bg-slate-700 text-slate-100"
                    aria-label="답을 입력하세요"
                    disabled={isUiLocked}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ChoiceButton 
                    text="정답 제출" 
                    type="submit"
                    disabled={isUiLocked || !gameState.userInput.trim()}
                    className="flex-1 bg-sky-600 hover:bg-sky-500"
                  />
                  <ChoiceButton 
                    text={gameState.isHintVisible ? "힌트 숨기기" : "힌트 보기"} 
                    onClick={toggleHint}
                    type="button"
                    className="flex-1 bg-amber-600 hover:bg-amber-500"
                    disabled={isUiLocked}
                  />
                </div>
              </form>
            )}
            
            {gameState.isHintVisible && gameStatus === GameStatus.PROBLEM_READY && (
              <div className="mt-6 p-4 bg-slate-700/80 border border-slate-600 rounded-md shadow">
                <h3 className="text-md font-semibold text-yellow-300 mb-2 font-display">힌트:</h3>
                <p className="text-slate-300 text-sm">{gameState.currentProblem.hint}</p>
              </div>
            )}
             {gameStatus === GameStatus.CHECKING_ANSWER && (
                <div className="my-4 text-center text-slate-400 flex items-center justify-center">
                    <LoadingSpinner size="w-6 h-6" />
                    <span className="ml-2">답변 확인 중...</span>
                </div>
            )}
          </div>
        </main>
      )}
       <footer className="text-center text-slate-500 mt-12 py-4 border-t border-slate-700 text-sm">
          <p>박물관 탈출 - 수학 어드벤처. 이미지는 Imagen API 제공.</p>
      </footer>
    </div>
  );
};

export default App;
