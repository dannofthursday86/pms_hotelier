/**
 * CloudStore - Centralized Cloud Storage API
 * Provides persistent data storage across all PMS pages
 */
const CloudStore = {
    STORAGE_KEY: 'cloudstay_pms_data',
    API_BASE: '/api/store',
    
    // In-memory cache
    data: {
        guests: [],
        reservations: [],
        rooms: [],
        roomTypes: [],
        activities: [],
        rates: [],
        housekeeping: [],
        folios: [],
        settings: {}
    },
    
    // Initialize - load from storage or create defaults
    async init() {
        try {
            // Try to load from localStorage first
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if data is valid (has guests array and it's not empty)
                if (parsed && parsed.guests && parsed.guests.length > 0) {
                    this.data = parsed;
                    console.log('CloudStore loaded from storage:', this.data.guests.length, 'guests');
                } else {
                    // Data incomplete, reinitialize
                    console.log('CloudStore data incomplete, reinitializing...');
                    await this.initializeDefaults();
                    await this.save();
                }
            } else {
                // No stored data, initialize defaults
                console.log('CloudStore: No stored data, initializing defaults...');
                await this.initializeDefaults();
                await this.save();
            }
        } catch (e) {
            console.error('CloudStore init error:', e);
            await this.initializeDefaults();
            await this.save();
        }
        return this.data;
    },
    
    // Save to localStorage
    async save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            console.log('CloudStore saved:', this.data.guests.length, 'guests');
        } catch (e) {
            console.error('CloudStore save error:', e);
        }
    },
    
    // Initialize default hotel data
    async initializeDefaults() {
        // Room Types
        this.data.roomTypes = [
            { id: 'STD', name: 'Standard', baseRate: 99, maxOccupancy: 2 },
            { id: 'DLX', name: 'Deluxe', baseRate: 149, maxOccupancy: 2 },
            { id: 'SUP', name: 'Superior', baseRate: 199, maxOccupancy: 3 },
            { id: 'STE', name: 'Suite', baseRate: 299, maxOccupancy: 4 },
            { id: 'PENT', name: 'Penthouse', baseRate: 499, maxOccupancy: 6 }
        ];
        
        // Generate 100 Rooms
        const statuses = ['available', 'available', 'occupied', 'occupied', 'reserved', 'maintenance'];
        this.data.rooms = [];
        let roomId = 1;
        for (let floor = 1; floor <= 5; floor++) {
            for (let num = 1; num <= 20; num++) {
                const typeIdx = Math.floor(Math.random() * this.data.roomTypes.length);
                this.data.rooms.push({
                    id: roomId++,
                    number: `${floor}${num.toString().padStart(2, '0')}`,
                    type: this.data.roomTypes[typeIdx].id,
                    floor: floor,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    rate: this.data.roomTypes[typeIdx].baseRate,
                    amenities: [],
                    blocked: false
                });
            }
        }
        
        // Sample Guests
        const names = [
            { first: 'James', last: 'Wilson' },
            { first: 'Maria', last: 'Garcia' },
            { first: 'John', last: 'Smith' },
            { first: 'Sarah', last: 'Johnson' },
            { first: 'Michael', last: 'Brown' },
            { first: 'Emma', last: 'Davis' },
            { first: 'Robert', last: 'Miller' },
            { first: 'Lisa', last: 'Anderson' }
        ];
        
        this.data.guests = names.map((name, i) => ({
            id: `G${String(i+1).padStart(4, '0')}`,
            firstName: name.first,
            lastName: name.last,
            email: `${name.first.toLowerCase()}@email.com`,
            phone: `+1 555 ${Math.floor(Math.random()*900)+100} ${Math.floor(Math.random()*9000)+1000}`,
            country: ['USA', 'UK', 'Spain', 'France', 'Germany'][Math.floor(Math.random() * 5)],
            type: Math.random() > 0.7 ? 'VIP' : 'Regular',
            notes: '',
            createdAt: new Date().toISOString()
        }));
        
        // Generate Reservations
        const today = new Date();
        this.data.reservations = [];
        for (let i = 0; i < 30; i++) {
            const checkIn = new Date(today.getTime() + (Math.random()-0.4)*14*24*60*60*1000);
            const checkOut = new Date(checkIn.getTime() + (Math.floor(Math.random()*4)+1)*24*60*60*1000);
            const guest = this.data.guests[Math.floor(Math.random() * this.data.guests.length)];
            const room = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];
            const status = checkIn.toDateString() === today.toDateString() ? 'due_in' : 
                        checkOut.toDateString() === today.toDateString() ? 'due_out' : 'confirmed';
            
            this.data.reservations.push({
                id: `RES${String(i+1).padStart(4, '0')}`,
                guestId: guest.id,
                guestName: `${guest.firstName} ${guest.lastName}`,
                roomId: room.id,
                roomNumber: room.number,
                checkIn: checkIn.toISOString().split('T')[0],
                checkOut: checkOut.toISOString().split('T')[0],
                status: status,
                rate: 99 + Math.floor(Math.random() * 200),
                source: 'direct',
                notes: '',
                createdAt: new Date().toISOString()
            });
        }
        
        // Activities
        const actions = ['checked in', 'checked out', 'created reservation', 'updated profile'];
        this.data.activities = [];
        for (let i = 0; i < 10; i++) {
            const guest = this.data.guests[Math.floor(Math.random() * this.data.guests.length)];
            this.data.activities.push({
                id: i + 1,
                guest: `${guest.firstName} ${guest.lastName}`,
                action: actions[Math.floor(Math.random() * actions.length)],
                time: new Date(Date.now() - Math.random() * 8*60*60*1000).toISOString()
            });
        }
        
        // Housekeeping Tasks
        this.data.housekeeping = [];
        for (let i = 0; i < 15; i++) {
            const room = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];
            this.data.housekeeping.push({
                id: i + 1,
                roomId: room.id,
                roomNumber: room.number,
                type: ['cleaning', 'deep_clean', 'turnover', 'inspection'][Math.floor(Math.random() * 4)],
                assignedTo: ['Maria', 'Juan', 'Sofia', 'Carlos'][Math.floor(Math.random() * 4)],
                priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
                status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
                notes: '',
                createdAt: new Date().toISOString()
            });
        }
        
        // Rates & Settings
        this.data.rates = [];
        this.data.settings = {
            hotelName: 'CloudStay Hotel',
            currency: 'USD',
            timezone: 'America/New_York',
            checkInTime: '15:00',
            checkOutTime: '11:00'
        };
    },
    
    // CRUD Operations - Guests
    async createGuest(guest) {
        const newGuest = {
            ...guest,
            id: `G${String(this.data.guests.length + 1).padStart(4, '0')}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.guests.push(newGuest);
        await this.save();
        console.log('Guest created:', newGuest.id);
        return newGuest;
    },
    
    async updateGuest(id, updates) {
        const index = this.data.guests.findIndex(g => g.id === id);
        if (index >= 0) {
            this.data.guests[index] = {
                ...this.data.guests[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.save();
            return this.data.guests[index];
        }
        return null;
    },
    
    async deleteGuest(id) {
        const index = this.data.guests.findIndex(g => g.id === id);
        if (index >= 0) {
            this.data.guests.splice(index, 1);
            await this.save();
            return true;
        }
        return false;
    },
    
    // CRUD Operations - Reservations
    async createReservation(reservation) {
        const newReservation = {
            ...reservation,
            id: `RES${String(this.data.reservations.length + 1).padStart(4, '0')}`,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.reservations.push(newReservation);
        
        // Update room status if checked-in
        if (newReservation.status === 'checked_in') {
            const roomIdx = this.data.rooms.findIndex(r => r.id === newReservation.roomId);
            if (roomIdx >= 0) {
                this.data.rooms[roomIdx].status = 'occupied';
            }
        }
        
        await this.save();
        console.log('Reservation created:', newReservation.id);
        return newReservation;
    },
    
    async updateReservation(id, updates) {
        const index = this.data.reservations.findIndex(r => r.id === id);
        if (index >= 0) {
            const oldStatus = this.data.reservations[index].status;
            this.data.reservations[index] = {
                ...this.data.reservations[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            // Handle room status changes
            if (updates.status === 'checked_in' && oldStatus !== 'checked_in') {
                const roomIdx = this.data.rooms.findIndex(r => r.id === this.data.reservations[index].roomId);
                if (roomIdx >= 0) {
                    this.data.rooms[roomIdx].status = 'occupied';
                }
            } else if (updates.status === 'checked_out' && oldStatus !== 'checked_out') {
                const roomIdx = this.data.rooms.findIndex(r => r.id === this.data.reservations[index].roomId);
                if (roomIdx >= 0) {
                    this.data.rooms[roomIdx].status = 'available';
                }
            }
            
            await this.save();
            return this.data.reservations[index];
        }
        return null;
    },
    
    // CRUD Operations - Rooms
    async createRoom(room) {
        const newRoom = {
            ...room,
            id: this.data.rooms.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.rooms.push(newRoom);
        await this.save();
        console.log('Room created:', newRoom.id);
        return newRoom;
    },
    
    async updateRoom(id, updates) {
        const index = this.data.rooms.findIndex(r => r.id === id);
        if (index >= 0) {
            this.data.rooms[index] = {
                ...this.data.rooms[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.save();
            return this.data.rooms[index];
        }
        return null;
    },
    
    // Housekeeping
    async createHousekeeping(task) {
        const newTask = {
            ...task,
            id: this.data.housekeeping.length + 1,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.housekeeping.push(newTask);
        await this.save();
        console.log('Housekeeping task created:', newTask.id);
        return newTask;
    },
    
    async updateHousekeeping(id, updates) {
        const index = this.data.housekeeping.findIndex(h => h.id === id);
        if (index >= 0) {
            this.data.housekeeping[index] = {
                ...this.data.housekeeping[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            await this.save();
            return this.data.housekeeping[index];
        }
        return null;
    },
    
    // Settings
    async getSettings() {
        return { ...this.data.settings };
    },
    
    async updateSettings(updates) {
        this.data.settings = { ...this.data.settings, ...updates };
        await this.save();
        return this.data.settings;
    },
    
    // Clear all data (for testing)
    async clear() {
        this.data = {
            guests: [],
            reservations: [],
            rooms: [],
            roomTypes: [],
            activities: [],
            rates: [],
            housekeeping: [],
            folios: [],
            settings: {}
        };
        await this.save();
    }
};

// Export for use in other scripts
window.CloudStore = CloudStore;