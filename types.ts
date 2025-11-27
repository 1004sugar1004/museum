
export enum GameStatus {
  API_KEY_MISSING = 'API_KEY_MISSING',
  WELCOME = 'WELCOME',
  LOADING_PROBLEM = 'LOADING_PROBLEM', // Covers image loading for the problem
  PROBLEM_READY = 'PROBLEM_READY',    // Problem and image loaded, awaiting answer
  CHECKING_ANSWER = 'CHECKING_ANSWER',
  SHOWING_HINT = 'SHOWING_HINT',      // A temporary state or flag
  GAME_WON = 'GAME_WON',
  GAME_OVER_RESTART = 'GAME_OVER_RESTART', // Player failed, show message and restart option
  ERROR = 'ERROR', // General error state
}

export interface MathProblem {
  id: number;
  stageTitle: string;
  narrativeContext: string;
  questionMath: string;
  answer: string; // Answers will be strings for easy comparison with input
  hint: string;
  imagePromptSuggestion: string;
  successNarrative: string;
}

export interface GameState {
  currentProblemIndex: number;
  currentProblem: MathProblem | null;
  currentImageUrl: string | null;
  userInput: string;
  isHintVisible: boolean;
  isLoadingImage: boolean;
  attempts: number; // Could be used for logic like "3 tries per problem" in future
}
