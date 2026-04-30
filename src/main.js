import { Game } from './game/engine.js';
import { StartScreen } from './ui/start-screen.js';
import { StoryScreen } from './ui/story-screen.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('game-canvas');
    const uiLayer = document.getElementById('ui-layer');
    
    const startGameScreen = () => {
        const startScreen = new StartScreen(uiLayer, (charClass) => {
            const game = new Game(canvas, uiLayer, charClass);
            game.state = 'WORLD';
            
            // Start Audio Context on user gesture
            game.audio.init();
            game.audio.playWorldMusic();
            
            game.updateHUD();
            game.start();
        });
        
        startScreen.render();
    };

    const storyScreen = new StoryScreen(uiLayer, startGameScreen);
    storyScreen.render();
});
