import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber';
import Box from './Box';
// import Modal from './Modal';
import Modal from 'react-responsive-modal';
// import useModal from "./useModal";
import * as THREE from 'three';
import {
  CubeTextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  RGBFormat,
  LinearMipmapLinearFilter,
} from "three";
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader'
import './styles.css';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Html, useGLTF, useTexture, Stars, Sky,  } from '@react-three/drei';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import VirtualScroll from 'virtual-scroll';
import { attackData } from "./data";
import scrollicon from "./asset/scrolldown.png";

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });
const r = 20;

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return <orbitControls
          ref={controls}
          args={[camera, domElement]}
          enableZoom={true}
          // maxAzimuthAngle={0}
          // maxPolarAngle={0}
          // minAzimuthAngle={0}
          // minPolarAngle={0}
          />;
};

const scroller = new VirtualScroll()

function Dolly() {
  let ypos=0;
  scroller.on(event => {
  	// wrapper.style.transform = `translateY(${event.y}px)`
    ypos = event.y;
  })


  // This one makes the camera move in and out
  useFrame(({ camera }) => {
    // camera.position.z = 8+Math.cos(ypos/1300);
    camera.position.z = r*Math.sin(ypos/5000);
    camera.position.x = r*Math.cos(ypos/5000);

    camera.position.y = -ypos/1000;

    if (Math.abs(ypos/1000) > 15) {
      document.getElementsByClassName("instrcution")[0].style.height = "0";
      document.getElementsByClassName("instrcution")[0].style.opacity = "0";
      document.getElementsByClassName("instrcution")[0].style.overflow = "hidden";
    }
    // camera.position.x = -15+Math.cos((ypos)/1300+0.9)*5;
    // camera.position.x = Math.cos(ypos/2000);

    // var quaternion = new THREE.Quaternion;
    // var axis = new THREE.Vector3( 0, 1, 0 );
    // let r = Math.cos(ypos/300);
    // camera.position.applyQuaternion( quaternion.setFromAxisAngle(
    //   axis, Math.PI * 2 * r
    // ));

    // console.log(camera.position.x, camera.position.y, camera.position.z)
  })
  return null
}

function Environment({ background = false }) {
  const { gl, scene } = useThree()
  const [cubeMap] = useLoader(HDRCubeTextureLoader, [['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']], (loader) => {
    loader.setDataType(THREE.UnsignedByteType)
    loader.setPath('./asset/pisaHDR/')
  })
  useEffect(() => {
    const gen = new THREE.PMREMGenerator(gl)
    gen.compileEquirectangularShader()
    const hdrCubeRenderTarget = gen.fromCubemap(cubeMap)
    cubeMap.dispose()
    gen.dispose()
    if (background) scene.background = hdrCubeRenderTarget.texture
    scene.environment = hdrCubeRenderTarget.texture
    return () => (scene.environment = scene.background = null)
  }, [cubeMap])
  return null
}

// function SkyBox() {
//   const { scene } = useThree();
//   const loader = new CubeTextureLoader();
//   // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
//   const texture = loader.load([
//     "./asset/1.jpeg",
//     "./asset/2.jpeg",
//     "./asset/3.jpeg",
//     "./asset/4.jpeg",
//     "./asset/5.jpeg",
//     "./asset/6.jpeg",
//
//   ]);
//   // Set the scene background property to the resulting texture.
//   scene.background = texture;
//   return null;
// }

class App extends React.Component {
  state = {
    posts: [],
    open: false,
    selectedPost: null // Keep track of the selected post
  };

  onOpenModal = i => {
    this.setState({
      open: true,
      selectedPost: i // When a post is clicked, mark it as selected
    });

  };

  onCloseModal = () => {
    this.setState({ open: false });

  };

  createTable = () => {
    let panel = [];
    let adj = 5;
    for (let i=0; i<14; i++){
      let row = [];
      for (let j=0; j<3; j++){
        // panel.push(<Box key={key} position={[-10+j+Math.cos(i/2+0.9)*3, -5+i, Math.random(-10,10)]} />);
        let id = i.toString()+j.toString();
        panel.push(<Box key={id} position={[j*5, i*5, adj]}  onClick={() => this.onOpenModal(id)} />);
        adj *= -1;
      }
    }
    return panel;
  };

  renderModal = () => {
    // Check to see if there's a selected post. If so, render it.
    if (this.state.selectedPost !== null && this.state.open == true) {
      console.log(this.state.selectedPost);
      const id = this.state.selectedPost;

      let res = attackData.filter(function(item){
        // console.log("id", id);
        // console.log("item.id", item.id);
        return item.id == id;
      })
      let time = res[0].time;
      let location = res[0].location;
      let description = res[0].description;
      let url = res[0].url;
      console.log(time, location, description, url);


      return (
        <div className="modal-style">
          <p>{time}, {location}</p>
          <hr className="solid" />
          <h1>{description}</h1>
          <a target="_blank" href={url}>View More</a>
        </div>
      );
    }
  }

  render() {
    const { open } = this.state;
    return (
      <div className="wrapper">
        <Modal open={open} onClose={() => this.onCloseModal()} center>
          <div>{this.renderModal()}</div>
        </Modal>
        <header className="header">
          <h1>Anti-Asia Attack Cases</h1>
          <h4>Anti-Asian Racism and Discrimination did not start with Covid-19</h4>
          <div>Case Data Credit: <a href="https://www.nytimes.com/interactive/2021/04/03/us/anti-asian-attacks.html">New York Times</a></div>
        </header>
        <Canvas camera={{ position: [r, 0, 0], fov: 69 }}>
          <CameraControls />
          <color attach="background" args={["#4B453C"]} />
          <Sky />
          <Stars />
          <ambientLight color = {0xffffff} intensity={0.3} />
          <spotLight position={[50, 75, 50]} angle={0.30} penumbra={1} />
          <spotLight position={[0, 75, 50]} angle={0.30} penumbra={1} />
          <spotLight position={[0, 75, 0]} angle={0.30} penumbra={1} />
          {this.createTable()}
          <Dolly />
        </Canvas>
        <div className="instrcution">
          <img src={scrollicon} width="32px"/>
          <h3>Scroll</h3>
        </div>
      </div>

    );
  }
}
export default App;
