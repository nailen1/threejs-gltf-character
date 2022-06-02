import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { RGBELoader } from "../examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";
import { Object3D } from "three";

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    #mesh;
    #control;
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields

    constructor() {
        console.log("Hello, three.js");

        const domContainer = document.querySelector("#webgl_container");
        this.#domContainer = domContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        domContainer.appendChild(renderer.domElement);
        this.#renderer = renderer;

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color("#9b596b");
        // scene.fog = new THREE.Fog("#9b596b", 0, 150);
        //흉내낸 안개. 안개는 배경이 아닌 매쉬에 적용됨. 그래서 배경색이랑 같게.
        // scene.fog = new THREE.FogExp2("#9b596b", 0.02);
        //  exp 함수의 지수값 입력. 사실적 안개.

        this.#scene = scene;

        this.#setupCamera();
        this.#setupLight();
        this.#setupBackground();
        this.#setupControls();
        // this.#setupModel();

        this.resize();

        window.onresize = this.resize.bind(this);
        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        console.log("resize");
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();

        this.#renderer.setSize(width, height);
    }

    #setupCamera() {
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            1000
        );

        camera.position.set(0, 0, 130);
        this.#camera = camera;
    }

    #setupLight() {
        const ambLight = new THREE.AmbientLight("#ffffff", 2);
        this.#scene.add(ambLight);

        const drLight = new THREE.DirectionalLight("#ffffff", 2);
        this.#scene.add(drLight);

        // const color = 0xffffff;
        // const intensity = 1;
        // const light = new THREE.DirectionalLight(color, intensity);
        // light.position.set(-1, 2, 4);
        // this.#scene.add(light);
    }

    #setupModel() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("data/gltf/character.glb", (gltf) => {
            const obj3d = gltf.scene;
            this.#scene.add(obj3d);
        });
    }

    #setupBackground() {
        const loader = new RGBELoader();
        loader.load("./data/hdr/studio_small_09_4k.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            // this.#scene.background = texture;
            this.#scene.environment = texture;
            // HDR 이용한 광원효과
            this.#setupModel();
        });
    }

    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }

    update(time) {
        time *= 0.001; // MS -> Second
        this.#control.update();
    }

    render(time) {
        this.#renderer.render(this.#scene, this.#camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
}

window.onload = function () {
    new App();
}
