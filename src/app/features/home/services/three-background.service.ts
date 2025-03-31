import { Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThemeService } from '../../../core/services/theme.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeBackgroundService implements OnDestroy {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;
  private animationFrameId: number | null = null;
  private controls: OrbitControls | null = null;
  
  constructor(
    private ngZone: NgZone,
    private themeService: ThemeService
  ) {}

  initialize(canvas: HTMLCanvasElement): void {
    // Scene setup
    this.scene = new THREE.Scene();
    
    this.scene.background = null;

    // Camera setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 30;
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add particles
    this.createParticles();
    
    // Controls (optional, can be removed if you want a fixed view)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Start animation loop
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });

    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      if (this.particles && this.particles.material) {
        // Adjust particle properties based on theme
        const material = this.particles.material as THREE.PointsMaterial;
        
        if (isDarkMode) {
          // Brighter particles in dark mode
          material.size = 0.35;
          material.opacity = 0.9;
        } else {
          // Slightly dimmer in light mode
          material.size = 0.3;
          material.opacity = 0.7;
        }
      }
    });

  }
  
  private createParticles(): void {
    if (!this.scene) return;
    
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorPalette = [
      new THREE.Color(0x38bdf8), // Brighter blue
      new THREE.Color(0x818cf8), // Brighter indigo
      new THREE.Color(0xa78bfa), // Brighter violet
      new THREE.Color(0xf472b6), // Brighter pink
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    if (this.particles) {
      this.particles.rotation.x += 0.0003;
      this.particles.rotation.y += 0.0005;
    }
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.render();
  }
  
  private render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    // Dispose of Three.js resources
    if (this.particles) {
      if (this.particles.geometry) {
        this.particles.geometry.dispose();
      }
      if ((this.particles.material as THREE.Material)) {
        (this.particles.material as THREE.Material).dispose();
      }
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.controls = null;
  }
}