import { Component, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineItem {
  title: string;
  description: string;
  visible: boolean;
}

interface Particle {
  left: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    @keyframes float-up {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      10%, 90% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-100vh);
        opacity: 0;
      }
    }

    .particle {
      position: absolute;
      bottom: -10px; /* Start off-screen */
      background: rgba(200, 180, 255, 0.3); /* Light purple to match theme */
      border-radius: 50%;
      animation: float-up linear infinite;
      filter: blur(1px);
    }

    @keyframes pulse-glow {
      0% {
        box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.5);
      }
      70% {
        box-shadow: 0 0 0 12px rgba(168, 85, 247, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
      }
    }

    .animate-pulse-glow {
      animation: pulse-glow 1.5s ease-out;
    }
  `]
})
export class AppComponent implements OnInit {
  titleVisible = signal(false);
  
  initialTimelineData = [
    { title: 'Message On Telegram', description: 'All you need to do is click the button below and send a message.' },
    { title: 'Give Project Details & Files', description: 'Provide us with all the pdf, knowledge and files we need to do your project & homework.' },
    { title: 'Wait For Our Response', description: 'Our team members will connect with you as soon as possible.' },
    { title: 'Do Payment & Get Your Work', description: 'Do the required payment and get your work done.' },
    { title: 'What do we do?', description: 'We help with coding, projects, assignments, dissertations, homework, final year project, computer science and programming related works!' }
  ];

  timelineItems = signal<TimelineItem[]>(
    this.initialTimelineData.map(item => ({ ...item, visible: false }))
  );

  particles = signal<Particle[]>([]);
  ctaVisible = signal(false);
  telegramUrl = 'https://t.me/your_uk_uni_helper';

  // Used to calculate the animated height of the timeline line
  readonly stepHeightInRem = 7.75; // Approx height + margin of one timeline item

  timelineLineHeight = computed(() => {
    const visibleCount = this.timelineItems().filter(item => item.visible).length;
    
    if (visibleCount <= 1) {
      return 0; // No line needed for 0 or 1 item
    }

    // Calculate height to connect the visible dots
    let height = (visibleCount - 1) * this.stepHeightInRem;

    // Add extra length to extend towards the CTA button when it appears
    if (this.ctaVisible()) {
      height += this.stepHeightInRem;
    }

    return height;
  });

  ngOnInit(): void {
    this.animateSequence();
    this.generateParticles();
  }

  generateParticles(): void {
    const numParticles = 2000;
    const newParticles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 5 + 2;
      newParticles.push({
        left: `${Math.random() * 100}vw`,
        size: `${size}px`,
        animationDuration: `${Math.random() * 20 + 15}s`,
        animationDelay: `${Math.random() * 20}s`,
      });
    }
    this.particles.set(newParticles);
  }

  animateSequence(): void {
    // Animate title
    setTimeout(() => this.titleVisible.set(true), 300);

    // Animate timeline items
    this.timelineItems().forEach((_, index) => {
      setTimeout(() => {
        this.timelineItems.update(items => {
          items[index].visible = true;
          return [...items];
        });

        // After the last item, show the CTA
        if (index === this.timelineItems().length - 1) {
          setTimeout(() => this.ctaVisible.set(true), 600);
        }
      }, 1000 + index * 500);
    });
  }

  openTelegram(): void {
    window.open(this.telegramUrl, '_blank');
  }
}