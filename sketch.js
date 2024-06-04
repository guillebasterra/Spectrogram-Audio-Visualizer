let song = null; // Initialize song to null
let playing = false;
let fr = 57;
let a, b; // Variables used in your draw function

function preload() {
    // No initial song is loaded
}

function loadSong(file) {
    song = loadSound(URL.createObjectURL(file), () => {
        document.getElementById("audio").innerText = "Play";
        playing = false;
        a = 360 / (song.duration() * fr);
        b = a;
        // Additional setup for the song if needed
        song.onended(() => {playing = false; document.getElementById("audio").innerText = "Play"; a = a});
    });
}

function setup() {
    createCanvas(500, 500);
    layer = createGraphics(width, height);
    background('white');
    fft = new p5.FFT(0, 256);

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadSong(file);
        }
    });
}

function draw() {
    if (song && song.isLoaded()) {
        background(255);

        // Set color mode to HSB for more vibrant color transitions
        colorMode(HSB, 255);
        layer.colorMode(HSB, 255);

        var spectrumA = fft.analyze();
        var spectrumB = spectrumA.reverse();
        spectrumB.splice(0, 40); // Remove the lowest frequencies
        
        // Calculate total amplitude for volume sensitivity
        let totalAmp = 0;
        for (let i = 0; i < spectrumB.length; i++) {
            totalAmp += spectrumB[i];
        }
        
        let averageAmp = totalAmp / spectrumB.length;
        let brightness = map(averageAmp, 0, 256, 50, 255); // Map average amplitude to brightness

        push();
        translate(width / 2, height / 2);
        noFill();

        for (let i = 0; i < spectrumB.length; i++) {
            var amp = spectrumB[i];
            var y = map(i, 0, spectrumB.length, 30, 215);

            // Use the average amplitude to affect the color's brightness
            var hue = map(amp, 0, 256, 0, 255); // Map amplitude to hue for color changes
            var sat = map(amp, 0, 256, 50, 255); // Map amplitude to saturation for color changes

            stroke(hue, sat, brightness); // Set stroke to HSB color mode
            strokeWeight(0);
            line(0, y, 0, y + amp / 10); // Adjust the line length based on amplitude
        }

        pop();

        push();
        translate(width / 2, height / 2);
        rotate(radians(a));

        layer.push();
        layer.translate(width / 2, height / 2);
        layer.rotate(radians(-a));

        for (let i = 0; i < spectrumB.length; i++) {
            var amp = spectrumB[i];
            var hue = map(amp, 0, 256, 0, 255);
            var sat = map(amp, 0, 256, 50, 255);

            layer.stroke(hue, sat, brightness, spectrumB[i] / 40);
            layer.strokeWeight(0.018 * amp);
            layer.line(0, i, 0, i + amp / 10);
        }

        layer.pop();

        image(layer, -width / 2, -height / 2);
        pop();

        if (playing) {
            a += b;
        }

    }
}



function toggleAudio() {
    if (song && song.isLoaded()) {
        if (!playing) {
            song.play();
            document.getElementById("audio").innerText = "Pause";
        } else {
            song.pause();
            document.getElementById("audio").innerText = "Play";
        }
        playing = !playing;
    }
}




