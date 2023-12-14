import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap"

export default class Park{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.park = this.resources.items.park;
        this.actualPark = this.park.scene;
        this.lerp = {   
            current: 0,
            target: 0,
            ease:0.1
        };
        
        this.setModel();
        // this.setAnimation();
        this.onMouseMove();
    }

    setModel() {
        this.actualPark.traverse((child) => {
            console.log(child.name)
            if (child instanceof THREE.Mesh) {
                if (child.material instanceof THREE.Material) {
                    // Ensure transparency and correct sorting
                    child.material.transparent = true;
                    child.material.alphaTest = 0.5; // Adjust the value based on your needs
                    child.material.depthWrite = true; // Enable depth writing
                    child.material.side = THREE.DoubleSide;
    
                    // Enable casting and receiving shadows
                    child.castShadow = true;
                    child.receiveShadow = true;
    
                    // Enable sorting for the entire scene
                    this.scene.sortObjects = true;
    
                    // Optionally, adjust render order if needed
                    // child.renderOrder = 1; // Adjust the value based on your needs
                }
            }
        });
        this.scene.add(this.actualPark);
    }
    
    

    // setAnimation(){
    //     this.mixer = new THREE.AnimationMixer(this.actualPark);
    //     this.spin = this.mixer.clipAction(this.park.animations[0]);
    //     this.spin.play();
    // }

    onMouseMove(){
        window.addEventListener("mousemove", (e)=>{
            this.rotation = ((e.clientX - window.innerWidth/2)*2)/innerWidth;
            this.lerp.target = this.rotation * 0.05;
        });
    }

    resize(){

    }

    update(){
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualPark.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Customize this based on your requirements
                if(child.name !== "Plane"&&
                child.name !== "Plane001"&&
                child.name !== "Plane002"&&
                child.name !== "Plane003"&&
                child.name !== "Mountain"
                ){
                    child.rotation.y = this.lerp.current;
                }
                
            }
        });

        // this.mixer.update(this.time.delta * 0.002);
    }
}