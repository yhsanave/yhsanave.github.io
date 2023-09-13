const title = '@Yhsanave';
const titlePalettes = [
    ['#e28c00', '#e28c00', '#eccd00', '#eccd00', '#ffffff', '#62aedc', '#62aedc', '#203856', '#203856']
];
const titlePalette = _.sample(titlePalettes);

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=+[]\\/:<>;{}|~?';
const randChar = () => characters.charAt(Math.floor(rand(characters.length)));

const links = [
    {id: 'discord', href: 'https://discord.com/users/195694396115648512', text: ['Discord']},
    {id: 'twitter', href: 'https://twitter.yhsanave.me', text: ['Twitter']},
    {id: 'youtube', href: 'https://youtube.yhsanave.me/', text: ['You','Tube']},
    {id: 'anilist', href: 'https://anilist.yhsanave.me/', text: ['Ani','List']},
    {id: 'libib', href: 'https://yhsanave.libib.com/', text: ['Manga']},
    {id: 'steam', href: 'https://steamcommunity.com/id/yhsanave/', text: ['Steam']},
    {id: 'github', href: 'https://github.com/yhsanave', text: ['Github']},
    {id: 'mail', href: 'mailto:yhsanave@yhsanave.me', text: ['Email']},
    {id: 'venmo', href: 'https://venmo.yhsanave.me/', text: ['Venmo']},
    {id: 'paypal', href: 'https://paypal.yhsanave.me/', text: ['Pay','Pal']},
    {id: 'mastodon', href: 'https://mastodon.yhsanave.me/', text: ['Mastodon']},
    {id: 'tumblr', href: 'https://tumblr.yhsanave.me/', text: ['Tumblr']},
    {id: 'soundcloud', href: 'https://soundcloud.yhsanave.me/', text: ['SoundCloud']},
    {id: 'osu', href: 'https://osu.ppy.sh/users/7559714', text: ['osu!']},
    {id: 'prsk', copyText: '367762770000629763', text: ['PRSK:', '3677', '62770', '0006', '29763']},
    {id: 'switch', copyText: 'SW-0834-7237-5116', text: ['Switch:', 'SW-0834-7237-5116']}
];
const linkLength = (link) => link.text.join('').length;

const funcChars = [
    {char: 'X', func: () => clearFuncEffects()},
    {char: '@', func: () => applyWrapperBackground('@', 'linear-gradient(80deg, #40e0d0, #ff8c00, #ff0080, #ff8c00, #40e0d0)')},
    {char: '$', func: () => applyWrapperBackground('$', 'linear-gradient(80deg, #00ff00, #00ffff, #0000ff, #00ffff, #00ff00)')},
    {char: '^', func: () => applyWrapperBackground('^', 'linear-gradient(80deg, #e28c00, #eccd00, #ffffff, #62aedc, #203856, #62aedc, #ffffff, #eccd00, #e28c00)')},
    {char: '|', func: () => applyWrapperBackground('|', 'linear-gradient(80deg, rgba(25,25,25,1) 10%, rgba(0,255,0,1) 85%, rgba(25,25,25,1) 90%)')},
    {char: '&', func: () => toggleCharColors('&', ['#e28c00', '#eccd00', '#ffffff', '#62aedc', '#203856'])},
    {char: '%', func: () => toggleCharColors('%', ['#6B26D9', '#246EB9', '#4CB944', '#FFB30F', '#DB222A'])},
    {char: 'V', func: () => rainFall('V', '#FFFFFF','#0044FF', '#000044')},
    {char: '#', func: () => rainFall('#', '#00FF00','#00DD00', '#001100')},
    {char: '*', func: () => shatter()},
    {char: '+', func: () => twinkle()},
    {char: 'a', func: () => apple()}
];
const funcState = {
    background: '',
    text: '',
    textColors: [],
    shatter: false,
    twinkle: false,
    rain: '',
    rainColors: {head: '', tail: '', bg: ''},
    apple: false,
}

// Rain Vars
const rainFrequency = 250; // Time between new raindrops spawning in ms
const rainSpeed = 75; // Delay between each step of a raindrop falling down in ms
const rainWorker = new Worker('scripts/rainWorker.js');
rainWorker.onmessage = applyRainDrop;
var rainInterval;
$(':root').css('--rain-speed', `${rainSpeed}ms`)

// Grid Vars
const minRows = links.length+2;
const minColumns = Math.max(...links.map(l => linkLength(l)))+1;
const magicGrid = {rows: minRows, columns: minColumns};
$(':root').css('--ideal-rows', Math.floor(minRows*1.5)) // Try to scale the font so that there are ~50% more rows than links
$(':root').css('--min-columns', minColumns);

const mutationFrequency = 100; // Magic text update frequency in milliseconds
const mutationFactor = .02; // Percent of cells to update each cycle
const getMutations = () => Math.floor(magicGrid.rows * magicGrid.columns * mutationFactor);
const updateInterval = setInterval(() => mutate(getMutations()), mutationFrequency);

// Util functions
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (max, min=0) => Math.random() * (max - min) + min;
const spanify = (str) => Array.from(str).map(c => $('<span>').text(c));

function buildLink(link, row, col) {   
    let $elem = $(`<a id="link-${link.id}" class="magic-link"></a>`);
    if (link.href) $elem.prop({'href': link.href, 'target': '_blank'});
    if (link.copyText) { $elem.click(() => navigator.clipboard.writeText(link.copyText)); $elem.prop({'title': 'Click to Copy'}) };
    link.text.forEach((s, index) => {
        let charSpans = spanify(s);
        charSpans.forEach((sp, i) => {
            $elem.append($(sp)
                .addClass(`char link-char sublink-${index}`)
                .css({'--row': row, '--col': col+i+(link.text.slice(0, index).join('').length)})
                .prop({'data-row': row, 'data-col': col})
                .hide()
            );
        });
    });
    return $elem;
}

function buildGrid() {
    let wrapper = $('#magicWrapper');
    magicGrid.rows = Math.max(Math.floor(wrapper.height() / $('#scaleChar').height())-1, minRows);
    magicGrid.columns = Math.max(Math.floor(wrapper.width() / $('#scaleChar').width())-1, minColumns);
    wrapper.css({'--rows': magicGrid.rows, '--columns': magicGrid.columns});

    let linkSpacing = (magicGrid.rows) / links.length;
    let linkPositions = {1: {start: 1, end: title.length+1}}; // Initialized with the position of the title
    links.forEach((link, index) => {
        let row = Math.ceil(linkSpacing * (index + 1));
        let col = Math.floor(rand(magicGrid.columns - linkLength(link) - 1) + 1);
        let $link = buildLink(link, row, col);
        wrapper.append($link);
        linkPositions[row] = {start: col, end: col+linkLength(link)};
    });

    for (let row = 1; row<=magicGrid.rows; row++) {
        for (let col = 1; col<=magicGrid.columns; col++) {
            if (col >= linkPositions[row]?.start && col < linkPositions[row]?.end) {
                col = linkPositions[row]?.end-1;
                continue;
            }
            wrapper.append(
                $(`<span class='char magic-char' data-row="${row}" data-col="${col}">${randChar()}</span>`)
                .css({'--row': row, '--col': col})
                .hide()
            );
        }
    }

    let funcPositions = _.sampleSize($('.magic-char'), funcChars.length);
    funcChars.forEach((c, i) => {
        $(funcPositions[i])
        .removeClass('magic-char')
        .addClass('func-char')
        .text(c.char)
        .on('click', c.func)
    });
}

function mutate(strength) {
    if (funcState.twinkle) strength = Math.floor(strength / 5);
    let chars = _.sampleSize($('.magic-char'), strength);
    chars.forEach((c) => {
        $(c).text(randChar());
        
        if (funcState.text) $(c).css('color', _.sample(funcState.textColors));
        if (funcState.twinkle) {
            $(c).css({'color': '#fff', 'transition': 'color 0.1s'});
            setTimeout(() => {$(c).css({'color': '', 'transition': ''})}, 100);
        }
    });
}

async function animateIn() {
    await sleep(1000);
    await animateTitleIn();
    await sleep(500);
    $('.cursor').hide();
    await animateMagicTextIn(magicGrid.rows*magicGrid.columns/100, 1000);
}

async function animateTitleIn() {
    for (let i = 0; i < title.length; i++) {
        let titleChar = $(`<span id="title_${i}">${title[i]}</span>`).css({'color': titlePalette[i], '--i': i});
        $('.cursor').before(titleChar) ;
        await sleep(50);
    }
}

async function animateMagicTextIn(speed, duration) {
    let magicElements = _.shuffle($('.char'))
    let steps = Math.ceil(duration / speed);
    let perStep = Math.floor(magicElements.length / steps);
    for (let i = 0; i<magicElements.length; i++) {
        $(magicElements[i]).show();
        if (i % perStep === 0) await sleep(speed);
    }
}

function resize() {
    clearFuncEffects(['shatter']);
    $('.char').remove();
    $('.magic-link').remove();
    buildGrid();
    $('.char').show();
}

// Shatter effect
const shatterOptions = {
    translate: {min: -20, max: 20},
    rotate: {min: -1, max: 1},
    rotateAngle: {min: -45, max: 45}
}

$.fn.setShatterVars = function(tx = 0, ty = 0, tz = 0, rx = 0, ry = 0, rz = 0, ra = 0) {
    $(this).css({'--tx': `${tx}px`, '--ty': `${ty}px`, '--tz': `${tz}px`, '--rx': `${rx}`, '--ry': `${ry}`, '--rz': `${rz}`, '--ra': `${ra}deg`})
}

function applyShatter() {
    let elems = $('.shatter');
    Array.from(elems).forEach(element => {
        $(element).setShatterVars(...getShatterVars());
    });
};

function getShatterVars() {
    return [
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.translate.max, shatterOptions.translate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotate.max, shatterOptions.rotate.min),
        rand(shatterOptions.rotateAngle.max, shatterOptions.rotateAngle.min)
    ];
}

// Func Char functions
function clearFuncEffects(effects = ['background', 'text', 'shatter', 'twinkle', 'rain', 'apple']) {
    // applyWrapperBackground
    if (effects.includes('background')) {
        let wrapper = $('.magic-wrapper');
        wrapper.toggleClass('bg-text bg-gradient-flow', false);
        wrapper.css('background', '');
        funcState.background = '';
    }

    // toggleCharColors
    if (effects.includes('text')) {
        $('.magic-char').css('color', '')
        funcState.text = '';
        funcState.textColors = [];
    }

    // shatter
    if (effects.includes('shatter')) {
        $('.shatter').removeClass('shatter');
        funcState.shatter = false;
    }

    // twinkle
    if (effects.includes('twinkle')) {
        $('.magic-wrapper').removeClass('twinkle');
        funcState.twinkle = false;
    }

    // rainFall
    if (effects.includes('rain')) {
        $('.rain').removeClass('rain');
        $('.drop').removeClass('drop');
        clearInterval(rainInterval);
        funcState.rain = '';
        funcState.rainColors = {head: '', tail: '', bg: ''};
    }

    // apple
    if (effects.includes('apple')) {
        $('.magic-wrapper').removeClass('apple');
        funcState.apple = false;
    }
}

function applyWrapperBackground(char, background) {
    let state = funcState.background === char;
    if (state) {
        clearFuncEffects(['background']);
        return
    }
    
    clearFuncEffects(['text', 'rain', 'apple']);

    let wrapper = $('.magic-wrapper');
    wrapper.toggleClass('bg-text bg-gradient-flow', !state);
    wrapper.css('background', state ? 'none' : background);
    funcState.background = state ? '' : char;
}

function toggleCharColors(char, colors) {
    let state = funcState.text === char;
    if (state) {
        clearFuncEffects(['text']);
        return;
    }

    clearFuncEffects(['background', 'twinkle', 'rain', 'apple'])
    
    Array.from($('.magic-char')).forEach(c => {
        $(c).css('color', _.sample(colors))
    })

    funcState.text = char;
    funcState.textColors = colors;
}

function shatter() {
    $('.magic-wrapper').toggleClass('shake', !funcState.shatter);
    setTimeout(() => {$('.magic-wrapper').removeClass('shake')}, 800);
    
    $('.char').toggleClass('shatter', !funcState.shatter);
    funcState.shatter = !funcState.shatter;
    applyShatter();
}

function twinkle() {
    if (funcState.twinkle) {
        clearFuncEffects(['twinkle']);
        return;
    }

    clearFuncEffects(['text', 'rain', 'apple']);
    funcState.twinkle = !funcState.twinkle;
    $('.magic-wrapper').toggleClass('twinkle', funcState.twinkle)
}

function rainFall(char, headColor, tailColor, bgColor) {
    let state = funcState.rain !== char;
    if (!state) {
        clearFuncEffects(['rain']);
        return;
    }
    
    clearFuncEffects(['background', 'text', 'twinkle', 'apple']);
    clearInterval(rainInterval);
    $(':root').css({
        '--drop-head': headColor,
        '--drop-tail': tailColor,
        '--drop-bg': bgColor
    });
    $('.magic-wrapper').toggleClass('rain', state)
    rainInterval = setInterval(spawnRainDrop, rainFrequency);
    funcState.rain = char;
}

function spawnRainDrop() {
    rainWorker.postMessage({rows: magicGrid.rows, col: Math.floor(rand(magicGrid.columns, 1)), speed: rainSpeed});
}

function applyRainDrop(e) {
    if (!funcState.rain) return;
    let char = $(`.magic-char[data-row=${e.data.row}][data-col=${e.data.col}]`).addClass('drop');
    setTimeout(() => $(char).removeClass('drop'), 1000);
}

function apple() {
    if (funcState.apple) {
        clearFuncEffects(['apple']);
        return;
    }

    clearFuncEffects(['background', 'text', 'twinkle', 'rain']);
    $('.magic-wrapper').addClass('apple bg-text');
    funcState.apple = true;
}

async function main() {
    buildGrid();
    await animateIn();
}

$(window).on('resize', _.debounce(resize, 50))
$(document).ready(main)