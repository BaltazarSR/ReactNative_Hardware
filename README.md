# Activity Tracking Mobile App

A React Native fitness tracking application built with Expo that monitors physical activities using mobile device sensors including GPS, accelerometer, and pedometer.

## 📱 Project Overview

This application tracks user activities (walking, running, vehicle movement) in real-time by combining multiple hardware sensors and implementing an activity classification algorithm. It provides detailed statistics, logs, and route visualization for workout sessions.

---

## 🎯 Key Concepts Implemented

### 1. **Mobile Hardware Sensor Integration**

#### GPS/Location Services
- **Expo Location API** for real-time position tracking
- Implemented the **Haversine formula** to calculate accurate distances between GPS coordinates
- GPS warmup handling to filter initial inaccurate readings
- Speed calculation using both GPS-provided speed and manual calculations
- GPS drift filtering with minimum distance thresholds

#### Accelerometer
- **3-axis accelerometer data** (x, y, z) for motion detection
- Magnitude calculation using vector mathematics: `sqrt(x² + y² + z²)`
- Net acceleration extraction by subtracting gravity (1g) and converting to m/s²
- Real-time motion intensity monitoring

#### Pedometer
- Native step counting using device's built-in pedometer
- Baseline step tracking to count only workout-specific steps
- Calorie estimation based on step count (0.04 calories per step)

### 2. **Activity Classification Algorithm**

Created a **rule-based classifier** that determines activity type using:
- **Speed thresholds** (m/s)
- **Acceleration patterns** (m/s²)
- **Confidence scoring** for classification reliability

**Classification Logic:**
```
IDLE:     speed < 0.5 m/s, acceleration < 0.5 m/s²
WALKING:  0.5-2.5 m/s, acceleration 0.5-3.0 m/s²
RUNNING:  2.5-6.0 m/s, acceleration 3.0-8.0 m/s²
VEHICLE:  speed > 6.0 m/s
```

### 3. **Data Persistence**

- **AsyncStorage** for local data storage
- Session-based workout history
- Route data saved as coordinate arrays
- Statistics aggregation across multiple sessions

### 4. **React Native Architecture Patterns**

#### Service Layer Architecture
Separation of concerns with dedicated service classes:
- `LocationService` - GPS tracking
- `AccelerometerService` - Motion detection
- `PedometerService` - Step counting
- `ActivityClassifierService` - Activity classification
- `StorageService` - Data persistence
- `RouteService` - Map route management

#### Controller Pattern
Custom hooks (`useActivityController`, `useStatsController`, etc.) to:
- Manage component state
- Orchestrate multiple services
- Handle business logic
- Coordinate navigation

#### Model-Based Design
TypeScript interfaces and enums for:
- Type safety
- Data structure consistency
- Code maintainability

### 5. **React Navigation**

- **Native Stack Navigator** for screen management
- Type-safe navigation with TypeScript
- Modal presentations for Logs and Map screens
- Navigation parameters for data passing

### 6. **Real-Time Data Processing**

- **1-second update intervals** for all sensors
- Continuous data streaming and processing
- Live UI updates using React state
- Time-series data logging for session history

### 7. **Mathematical Calculations**

#### Haversine Formula (Distance)
```
a = sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)
c = 2 * atan2(√a, √(1−a))
d = R * c
```
Where R = 6,371km (Earth's radius)

#### Vector Magnitude (Acceleration)
```
magnitude = √(x² + y² + z²)
net_acceleration = |magnitude - 1g| * 9.81 m/s²
```

#### Speed Calculation
```
speed = distance / time
```

### 8. **Permission Management**

- Runtime permission requests for:
  - Location (foreground)
  - Motion sensors (accelerometer, pedometer)
- Graceful degradation when permissions denied
- User-friendly permission prompts

### 9. **Error Handling & Logging**

- Custom logger utility for debugging
- Try-catch blocks for async operations
- Service availability checks
- GPS accuracy validation

### 10. **React Hooks & Lifecycle Management**

- `useState` for component state
- `useEffect` for side effects and cleanup
- `useRef` for mutable values without re-renders
- `useNavigation` for programmatic navigation
- Custom hooks for complex logic encapsulation

---

## 📚 What I Learned

### Technical Skills

1. **Working with Mobile Sensors**
   - How GPS positioning works and its limitations
   - Understanding accelerometer data and coordinate systems
   - Filtering sensor noise and handling inaccurate readings
   - Dealing with GPS warmup periods and drift

2. **React Native Development**
   - Expo framework and its managed workflow
   - Cross-platform mobile development
   - Native module integration
   - Performance optimization for real-time updates

3. **TypeScript in Practice**
   - Interface design for complex data structures
   - Type-safe function parameters and returns
   - Enum usage for constants
   - Generic types for navigation

4. **State Management**
   - When to use state vs refs
   - Managing multiple interdependent states
   - Avoiding unnecessary re-renders
   - Synchronizing state with sensors

5. **Asynchronous Programming**
   - Promise handling
   - Async/await patterns
   - Event listeners and subscriptions
   - Cleanup functions in useEffect

6. **Software Architecture**
   - Service-oriented architecture
   - Separation of concerns
   - Single responsibility principle
   - Dependency management

### Problem-Solving Skills

1. **GPS Speed Inaccuracy**
   - **Problem:** GPS-reported speed was often unreliable
   - **Solution:** Implemented manual speed calculation using distance/time and added validation against maximum reasonable speeds

2. **GPS Drift While Stationary**
   - **Problem:** GPS coordinates fluctuate even when device is still
   - **Solution:** Added minimum distance threshold (1m) to filter drift

3. **Initial GPS Readings**
   - **Problem:** First 5-10 GPS readings have poor accuracy
   - **Solution:** Implemented warmup period that ignores initial readings

4. **Step Count Persistence**
   - **Problem:** Pedometer returns total device steps, not just workout steps
   - **Solution:** Baseline tracking that subtracts initial step count

5. **Time Gap Handling**
   - **Problem:** Large time gaps (app backgrounded) caused speed spikes
   - **Solution:** Speed set to 0 when time gap exceeds 5 seconds

6. **Activity Misclassification**
   - **Problem:** Activities confused due to overlapping characteristics
   - **Solution:** Combined multiple sensor inputs (speed + acceleration) with confidence scoring

## 🛠️ Technologies Used

### Core Framework
- **React Native** (0.81.5) - Mobile app framework
- **Expo** (~54.0.25) - Development platform
- **TypeScript** (~5.9.2) - Type safety

### Navigation
- **React Navigation** (7.1.21) - Screen navigation
- **Native Stack Navigator** (7.6.4) - Stack-based navigation

### Sensors & Hardware
- **expo-location** (19.0.7) - GPS tracking
- **expo-sensors** (15.0.7) - Accelerometer & pedometer
- **react-native-maps** (1.20.1) - Map visualization

### Storage & State
- **AsyncStorage** (2.2.0) - Local data persistence
- **React Hooks** - State management

### UI & Graphics
- **react-native-svg** (15.15.0) - Vector graphics
- **expo-font** (14.0.9) - Custom fonts

---

## 📊 App Features

- ✅ Real-time activity tracking (walking, running, vehicle)
- ✅ GPS route recording with map visualization
- ✅ Step counting and calorie estimation
- ✅ Distance and speed monitoring
- ✅ Activity classification with confidence levels
- ✅ Session history with detailed logs
- ✅ Aggregate statistics across all workouts
- ✅ Persistent storage of workout data

## Screenshots
<img width="293" height="633" alt="IMG_4427" src="https://github.com/user-attachments/assets/a47044ef-8c04-4228-83c5-2ce310db2004" />
<img width="293" height="633" alt="IMG_4425" src="https://github.com/user-attachments/assets/1914854d-b0f9-4ba3-b6a9-525b3107c6af" />
<img width="293" height="633" alt="IMG_4426" src="https://github.com/user-attachments/assets/8afe2e88-8975-4f11-8cd0-1da5805b4775" />
