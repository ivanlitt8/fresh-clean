import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export const BubblesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="bubbles"
      init={particlesInit}
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: [
              "rgba(173, 216, 230, 0.6)", // lightblue
              "rgba(224, 255, 255, 0.6)", // azure
              "rgba(240, 248, 255, 0.6)", // aliceblue
              "rgba(176, 224, 230, 0.6)", // powderblue
            ],
          },
          move: {
            angle: {
              offset: 0,
              value: 90,
            },
            direction: "top",
            enable: true,
            outModes: {
              default: "bounce",
              top: "bounce",
              bottom: "bounce",
              left: "bounce",
              right: "bounce",
            },
            random: false,
            speed: { min: 0.8, max: 1.5 },
            straight: false,
            warp: false,
            path: {
              enable: true,
              delay: {
                value: 0.1,
              },
              options: {
                size: 5,
                draw: false,
                increment: 0.001,
              },
            },
            trail: {
              enable: true,
              length: 3,
              fill: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          number: {
            density: {
              enable: true,
              area: 900,
            },
            value: 80,
          },
          opacity: {
            animation: {
              enable: true,
              speed: 0.25,
              sync: false,
              minimumValue: 0.3,
              count: 1,
            },
            value: { min: 0.4, max: 0.7 },
          },
          shadow: {
            blur: 5,
            color: {
              value: "#ffffff",
            },
            enable: true,
            offset: {
              x: 3,
              y: 3,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 15, max: 35 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 15,
              sync: false,
              count: 1,
            },
          },
          stroke: {
            color: {
              value: ["rgba(255, 255, 255, 0.3)"],
            },
            width: 2,
          },
          zIndex: {
            value: { min: 0, max: 100 },
            opacityRate: 0.5,
            sizeRate: 1,
            velocityRate: 1,
          },
          roll: {
            darken: {
              enable: true,
              value: 0.1,
            },
            enable: true,
            speed: {
              min: 5,
              max: 15,
            },
          },
          tilt: {
            enable: true,
            value: {
              min: 0,
              max: 360,
            },
            animation: {
              enable: true,
              speed: 30,
              decay: 0.05,
              sync: false,
            },
            direction: "random",
          },
          twinkle: {
            lines: {
              enable: true,
              frequency: 0.05,
              opacity: 0.5,
              color: {
                value: ["rgba(255, 255, 255, 0.4)"],
              },
            },
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 0.5,
            },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
};
