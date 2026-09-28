import * as THREE from 'three';

import {
    MindARThree
} from 'mindar-image-three';

import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


// ======================================================
// 1. CREATE MINDAR AR SYSTEM
// ======================================================

const mindarThree = new MindARThree({

    // Dedicated AR container
    container:
        document.getElementById(
            'ar-container'
        ),

    // MindAR image target
    imageTargetSrc:
        './targets/targets.mind',

    // Disable MindAR's built-in scanning UI
    // We are using our own scanner UI
    uiScanning: 'no',

    // Tracking smoothing
    filterMinCF: 0.0001,
    filterBeta: 0.001

});


// ======================================================
// 2. GET THREE.JS COMPONENTS
// ======================================================

const {
    renderer,
    scene,
    camera
} = mindarThree;


// ======================================================
// 3. RENDERER SETTINGS
// ======================================================

// Correct color output
renderer.outputColorSpace =
    THREE.SRGBColorSpace;


// Cinematic tone mapping
renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


// Increase exposure
renderer.toneMappingExposure =
    1.5;


// ======================================================
// 4. LIGHTING
// ======================================================

// ------------------------------------------------------
// Main ambient light
// ------------------------------------------------------

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        3
    );

scene.add(
    ambientLight
);


// ------------------------------------------------------
// Main directional light
// ------------------------------------------------------

const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        5
    );

directionalLight.position.set(
    5,
    10,
    5
);

scene.add(
    directionalLight
);


// ------------------------------------------------------
// Fill light
// ------------------------------------------------------

const fillLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

fillLight.position.set(
    -5,
    5,
    -5
);

scene.add(
    fillLight
);


// ======================================================
// 5. CREATE AR TARGET ANCHOR
// ======================================================

// Target index 0
const anchor =
    mindarThree.addAnchor(
        0
    );


// ======================================================
// 6. GET UI ELEMENTS
// ======================================================

const startButton =
    document.getElementById(
        'start-button'
    );

const startScreen =
    document.getElementById(
        'start-screen'
    );

const scanUI =
    document.getElementById(
        'scan-ui'
    );


// ======================================================
// 7. CHECK UI ELEMENTS
// ======================================================

if (!startButton) {

    console.error(
        'ERROR: #start-button was not found.'
    );

}


if (!startScreen) {

    console.error(
        'ERROR: #start-screen was not found.'
    );

}


if (!scanUI) {

    console.error(
        'ERROR: #scan-ui was not found.'
    );

}


// ======================================================
// 8. TARGET FOUND
// ======================================================

anchor.onTargetFound = () => {

    console.log(
        'Target found!'
    );


    // Hide our scanning UI
    if (scanUI) {

        scanUI.style.display =
            'none';

    }

};


// ======================================================
// 9. TARGET LOST
// ======================================================

anchor.onTargetLost = () => {

    console.log(
        'Target lost!'
    );


    // Show our scanning UI again
    if (scanUI) {

        scanUI.style.display =
            'flex';

    }

};


// ======================================================
// 10. LOAD GLB MODEL
// ======================================================

const loader =
    new GLTFLoader();


loader.load(

    // --------------------------------------------------
    // GLB FILE
    // --------------------------------------------------

    './model.glb',


    // --------------------------------------------------
    // MODEL LOADED
    // --------------------------------------------------

    function (gltf) {

        console.log(
            '3D model loaded successfully!'
        );


        // Get the actual model
        const model =
            gltf.scene;


        // ==============================================
        // ADD MODEL TO AR TARGET
        // ==============================================

        anchor.group.add(
            model
        );


        // ==============================================
        // MODEL SCALE
        // ==============================================

        model.scale.set(
            0.2,
            0.2,
            0.2
        );


        // ==============================================
        // MODEL POSITION
        // ==============================================

        model.position.set(
            0,
            0,
            0
        );


        // ==============================================
        // MODEL ROTATION
        // ==============================================

        model.rotation.set(
            0,
            0,
            0
        );


        // ==============================================
        // MODEL MESH SETTINGS
        // ==============================================

        model.traverse(
            function (object) {

                if (
                    object.isMesh
                ) {

                    // Enable shadow casting
                    object.castShadow =
                        true;

                    // Enable shadow receiving
                    object.receiveShadow =
                        true;

                }

            }
        );


        console.log(
            '3D model added to AR target.'
        );

    },


    // --------------------------------------------------
    // MODEL LOADING PROGRESS
    // --------------------------------------------------

    function (progress) {

        if (
            progress.total > 0
        ) {

            const percentage =
                (
                    progress.loaded /
                    progress.total
                ) * 100;


            console.log(
                'Loading model:',
                percentage.toFixed(0) + '%'
            );

        } else {

            console.log(
                'Loading model...'
            );

        }

    },


    // --------------------------------------------------
    // MODEL LOADING ERROR
    // --------------------------------------------------

    function (error) {

        console.error(
            'ERROR loading model.glb:',
            error
        );


        alert(
            'Unable to load the 3D model. Please check that model.glb is in the correct folder.'
        );

    }

);


// ======================================================
// 11. START AR FUNCTION
// ======================================================

async function startAR() {

    console.log(
        'Starting AR...'
    );


    try {

        // ------------------------------------------------
        // Start MindAR
        // ------------------------------------------------

        await mindarThree.start();


        console.log(
            'AR started successfully!'
        );


        // ------------------------------------------------
        // Start Three.js rendering
        // ------------------------------------------------

        renderer.setAnimationLoop(

            () => {

                renderer.render(
                    scene,
                    camera
                );

            }

        );


    } catch (error) {

        console.error(
            'ERROR starting AR:',
            error
        );


        throw error;

    }

}


// ======================================================
// 12. START AR BUTTON
// ======================================================

if (startButton) {

    startButton.addEventListener(

        'click',

        async function () {

            console.log(
                'START AR button clicked.'
            );


            // ==========================================
            // PREVENT MULTIPLE CLICKS
            // ==========================================

            startButton.disabled =
                true;


            // ==========================================
            // CHANGE BUTTON TEXT
            // ==========================================

            startButton.textContent =
                'STARTING AR...';


            // ==========================================
            // HIDE START SCREEN
            // ==========================================

            if (startScreen) {

                startScreen.style.display =
                    'none';

            }


            // ==========================================
            // SHOW SCANNING UI
            // ==========================================

            if (scanUI) {

                scanUI.style.display =
                    'flex';

            }


            // ==========================================
            // START AR
            // ==========================================

            try {

                await startAR();


                console.log(
                    'AR is ready.'
                );


                // ======================================
                // UPDATE BUTTON TEXT
                // ======================================

                startButton.textContent =
                    'AR STARTED';


            } catch (error) {

                console.error(
                    'Unable to start AR:',
                    error
                );


                // ======================================
                // RE-ENABLE BUTTON
                // ======================================

                startButton.disabled =
                    false;


                startButton.textContent =
                    'START AR';


                // ======================================
                // SHOW START SCREEN AGAIN
                // ======================================

                if (startScreen) {

                    startScreen.style.display =
                        'flex';

                }


                // ======================================
                // HIDE SCANNER
                // ======================================

                if (scanUI) {

                    scanUI.style.display =
                        'none';

                }


                // ======================================
                // USER MESSAGE
                // ======================================

                alert(
                    'Unable to start AR. Please check your camera permission and try again.'
                );

            }

        }

    );
}
