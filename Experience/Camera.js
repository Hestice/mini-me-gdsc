import Experience from "./Experience";
import * as THREE from "three";
import GSAP from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export default class Camera {
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.lerp = {
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
            ease: 0.1,
        };

        this.onMouseMove();
        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        // this.setOrbitControls();
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35, 
            this.sizes.aspect,
            0.1,
            100
        )
        this.scene.add(this.perspectiveCamera);
        this.perspectiveCamera.position.z = 5.5;
        this.perspectiveCamera.position.y = 2;
        this.perspectiveCamera.rotation.x = -0.25;
    }

    createOrthographicCamera(){
        this.frustrum = 5;
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 2,
            (this.sizes.aspect * this.sizes.frustrum) / 2,
            this.sizes.frustrum / 2,
            -this.sizes.frustrum / 2,
            -50,
            50
        )
        this.scene.add(this.orthographicCamera);
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.lerp.target.x = ((e.clientY - window.innerHeight / 2) * 2) / window.innerHeight *0.02;
            this.lerp.target.y = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth *0.02;
        });
    }

    resize() {
        // Updating Perspective Camera on Resize
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        // Updating Orthographic Camera on Resize
        this.orthographicCamera.left =
            (-this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.right =
            (this.sizes.aspect * this.sizes.frustrum) / 2;
        this.orthographicCamera.top = this.sizes.frustrum / 2;
        this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
        this.orthographicCamera.updateProjectionMatrix();
    }
    
    update() {
    // this.controls.update();

    this.lerp.current.x = GSAP.utils.interpolate(
        this.lerp.current.x,
        this.lerp.target.x,
        this.lerp.ease
    );
    this.lerp.current.y = GSAP.utils.interpolate(
        this.lerp.current.y,
        this.lerp.target.y,
        this.lerp.ease
    );

    // Limiting the rotation values to prevent extreme values
    const maxRotationX = Math.PI / 4;
    this.lerp.current.x = THREE.MathUtils.clamp(
        this.lerp.current.x,
        -maxRotationX,
        maxRotationX
    );
    const initialRotationX = -0.25; // Your initial rotation value

    // Combine both X and Y rotations
    this.perspectiveCamera.rotation.x = initialRotationX - this.lerp.current.x;
    this.perspectiveCamera.rotation.y = -this.lerp.current.y;
}

}