import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ThreeBackgroundService } from '../../services/three-background.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('threeCanvas') threeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('introTitle') introTitle!: ElementRef;
  @ViewChild('introSubtitle') introSubtitle!: ElementRef;
  @ViewChild('introDescription') introDescription!: ElementRef;
  @ViewChild('introButtons') introButtons!: ElementRef;
  @ViewChild('skillsTitle') skillsTitle!: ElementRef;
  @ViewChild('skillsGrid') skillsGrid!: ElementRef;
  @ViewChild('scrollIndicator') scrollIndicator!: ElementRef;
  
  previewSkills = [
    { name: 'Angular', icon: 'fa-angular' },
    { name: 'React', icon: 'fa-react' },
    { name: 'Node.js', icon: 'fa-node-js' },
    { name: 'TypeScript', icon: 'fa-js' },
    { name: 'UI/UX Design', icon: 'fa-bezier-curve' },
    { name: 'Responsive Design', icon: 'fa-mobile-alt' },
    { name: 'Three.js', icon: 'fa-cube' },
    { name: 'GSAP', icon: 'fa-tachometer-alt' },
  ];
  
  constructor(private threeBackgroundService: ThreeBackgroundService) {}
  
  ngOnInit(): void {
    // Any initialization logic
  }
  
  ngAfterViewInit(): void {
    // Initialize 3D background
    this.threeBackgroundService.initialize(this.threeCanvas.nativeElement);
    
    // Animate content elements
    this.animateContent();
  }
  
  private animateContent(): void {
    const timeline = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
    
    timeline
      .to(this.introTitle.nativeElement, { opacity: 1, y: 0, duration: 1 })
      .to(this.introSubtitle.nativeElement, { opacity: 1, y: 0 }, '-=0.6')
      .to(this.introDescription.nativeElement, { opacity: 1, y: 0 }, '-=0.6')
      .to(this.introButtons.nativeElement, { opacity: 1, y: 0 }, '-=0.4')
      .to(this.skillsTitle.nativeElement, { opacity: 1, y: 0 }, '-=0.2')
      .to(this.skillsGrid.nativeElement, { opacity: 1, y: 0 }, '-=0.1')
      .to(this.scrollIndicator.nativeElement, { opacity: 1, y: 0 }, '-=0.1');
  }
  
  ngOnDestroy(): void {
    // Cleanup will be handled by ThreeBackgroundService
  }
}