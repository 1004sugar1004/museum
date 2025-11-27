import { MathProblem } from './types';

export const IMAGEN_MODEL_NAME = "imagen-3.0-generate-002";

export const INTRO_NARRATIVE = `눈을 천천히 떠보니… 여긴 침대가 아니에요! 당신은 거대한 '미해결 미스터리 박물관' 안에 있습니다. 육중한 참나무 문은 잠겨 있고, 당신 앞에는 반짝이는 쪽지가 나타납니다:
<br><br>
<span class="font-handwriting text-yellow-300 text-xl">'지혜를 찾는 자여, 환영하노라! 탈출하려면 당신의 지혜를 증명해야 한다. 다섯 개의 도전이 기다리고 있으니, 모두 해결하면 자유를 얻을 것이고, 실패하면 처음부터 다시 시작해야 하리라. 자세히 보고, 깊이 생각하라.'</span>
<br><br>
당신의 모험은 '고대 측정 전시관'에서 시작됩니다.`;

export const GAME_WIN_NARRATIVE = (problemSuccessNarrative: string): string => `
  ${problemSuccessNarrative}
  <br><br>
  <strong class="text-2xl text-green-400 font-display">축하합니다, 어린 수학자님!</strong>
`;

export const GAME_OVER_NARRATIVE = `이런! 정답이 아니었어요. 반짝이는 안개가 당신을 감싸더니, 정신을 차려보니 박물관 입구로 돌아와 모든 퍼즐이 초기화되었습니다.
<br><br>
쪽지가 다시 나타납니다: <span class="font-handwriting text-orange-300 text-lg">'지식에는 끈기가 필요한 법. 포기하지 말고 다시 도전하라!'</span>`;

export const problems: MathProblem[] = [
  {
    id: 1,
    stageTitle: "고대 측정 전시관",
    narrativeContext: "당신은 오래된 지도와 특이한 자들로 가득한 '고대 측정 전시관'에 있습니다. 석판에 수수께끼가 새겨져 있습니다: '나는 작은 단위로, 나 10개가 모이면 1센티미터가 된다. 1센티미터 안에는 내가 몇 개나 있을까?'",
    questionMath: "1 cm = ? mm",
    answer: "10",
    hint: "자를 보세요. 1센티미터를 이루는 작은 눈금들을 세어보세요. 각 작은 눈금은 1밀리미터입니다.",
    imagePromptSuggestion: "Dimly lit museum exhibit with ancient scrolls and measuring tools on display cases, a single stone tablet with glowing inscription in the center, fantasy art style, mysterious atmosphere, high detail.",
    successNarrative: "정답입니다! 석판에 숫자 10이 빛나더니 숨겨진 서랍이 스르륵 열립니다. 안에는 신기한 톱니바퀴가 들어있습니다. 쪽지가 다시 반짝입니다: '이것을 가지고 길이의 다음 단계를 밟을 수 있는 '거인의 발자국'으로 가라.'"
  },
  {
    id: 2,
    stageTitle: "거인의 발자국",
    narrativeContext: "신화 속 거인의 것이라고 전해지는 거대한 석고 발자국에 도착했습니다. 명판에는 이렇게 적혀 있습니다: '거인의 발톱은 두 부분으로 측정되었다. 한 부분은 8센티미터였고, 그 옆의 작은 조각은 5밀리미터였다. 이 발톱 부분의 총 길이는 몇 밀리미터일까?'",
    questionMath: "8 cm 5 mm = ? mm",
    answer: "85",
    hint: "1센티미터는 10밀리미터라는 것을 기억하세요. 먼저 8센티미터를 밀리미터로 바꾸고, 그 다음 추가 5밀리미터를 더하세요.",
    imagePromptSuggestion: "A giant plaster footprint dominates a museum exhibit, a small child figure looking up in awe for scale, dramatic spotlighting, detailed texture on the footprint, museum background.",
    successNarrative: "맞습니다! 명판에 85가 빛납니다. 거인의 발자국이 우르릉거리더니 바닥의 일부가 내려가 '시간 기록실'로 이어지는 계단이 나타납니다."
  },
  {
    id: 3,
    stageTitle: "시간 기록실",
    narrativeContext: "이 방은 똑딱거리는 시계들과 고대 모래시계들로 가득합니다. 크고 조용한 괘종시계 문자반에는 물음표가 찍혀 있습니다. 근처 비문에는 이렇게 적혀 있습니다: '60개의 작은 똑딱임이 나를 온전하게 만들고, 1분의 짧은 이야기를 새긴다. 60초가 흘렀다면, 몇 분이 지난 것일까?'",
    questionMath: "60 초 = ? 분",
    answer: "1",
    hint: "이것은 일반적인 시간 단위입니다. 1분 안에 몇 초가 있는지 생각해보세요.",
    imagePromptSuggestion: "A mysterious, circular chamber in a museum filled with various antique clocks of all sizes and styles, and large hourglasses. A prominent grandfather clock stands in the center under a shaft of light. Steampunk elements, intricate details.",
    successNarrative: "똑-딱! 시계 문자반에 숫자 1이 나타납니다. 시계추가 옆으로 움직이며 작게 말린 지도를 보여줍니다. 쪽지가 업데이트됩니다: '학예사는 긴 산책을 좋아했다. 그의 지도를 따라 '위대한 여정' 전시관으로 가라.'"
  },
  {
    id: 4,
    stageTitle: "위대한 여정 전시관",
    narrativeContext: "이 전시관에는 배, 기차, 비행기 모형들이 전시되어 있습니다. 마을 디오라마에 퍼즐이 있습니다: '이 작은 모형 마을에서, 모형 학교는 모형 도서관에서 가상의 500미터 떨어져 있다. 모형 경찰서는 학교에서 그 거리의 세 배만큼 떨어져 있다. 학교에서 경찰서까지의 거리는 가상의 몇 미터일까?'",
    questionMath: "500 미터 × 3 = ? 미터",
    answer: "1500",
    hint: "다른 거리의 '세 배'인 거리를 찾으려면 원래 거리에 3을 곱해야 합니다.",
    imagePromptSuggestion: "A highly detailed museum diorama of a miniature old town with a school, library, and police station clearly visible. Miniature figures are present. Soft focused background, intricate details on buildings, eye-level view.",
    successNarrative: "훌륭한 계산입니다! 모형 경찰서에 불이 들어오고 지붕에서 작은 열쇠 구멍이 드러납니다. 첫 번째 퍼즐에서 얻은 톱니바퀴가 딱 맞습니다! 반짝이는 쪽지에 새로운 메시지가 나타납니다: '마지막 도전이 학예사의 책상에서 기다리고 있다. 시간이 촉박하다!'"
  },
  {
    id: 5,
    stageTitle: "학예사의 책상",
    narrativeContext: "여러 장식으로 꾸며진 나무 책상에 도착했습니다. 서류들이 흩어져 있고, 중앙에는 크고 오래된 스톱워치가 놓여 있습니다. 마지막 수수께끼입니다: '이 바늘이 한 바퀴 완전히 돌면 60초가 된다. 만약 바늘이 절반만 돈다면, 몇 초가 지난 것일까?'",
    questionMath: "60초의 절반은 ? 초",
    answer: "30",
    hint: "한 바퀴 도는 것이 60초라면, 그 여정의 절반은 몇 초일까요?",
    imagePromptSuggestion: "An old, ornate wooden museum curator's desk viewed from slightly above. Scattered papers, quills, inkwells, and a prominent antique brass stopwatch in the center. Dramatic focused lighting on the stopwatch, dusty, atmospheric.",
    successNarrative: "바로 그거예요! 스톱워치에 숫자 30이 빛납니다. 만족스러운 '철컥' 소리와 함께 박물관 정문이 열리는 소리가 들립니다. 반짝이는 쪽지에 이렇게 적혀 있습니다: '당신의 뛰어난 지혜가 증명되었다! 자유는 당신의 것이다. 당신의 호기심이 언제나 당신을 인도하길.' 당신은 무거운 문을 밀고 밝은 햇살 속으로 걸어 나갑니다. 미해결 미스터리 박물관의 성공적인 탈출자입니다!"
  }
];