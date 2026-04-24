/**
 * CloudStore - Centralized Cloud Storage API (Pesan PMS Style)
 * Provides persistent data storage across all PMS pages
 * Based on zustand store pattern with localStorage persistence
 */
const CloudStore = {
    STORAGE_KEY: 'pesan-pms-storage',
    API_BASE: '/api/store',
    
    // In-memory cache
    data: {
        properties: [],
        selectedPropertyId: null,
        rooms: [],
        guests: [],
        bookings: [],
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
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.state) {
                    // Zustand format
                    this.data = {
                        ...this.data,
                        properties: parsed.state.properties || [],
                        selectedPropertyId: parsed.state.selectedPropertyId,
                        rooms: parsed.state.rooms || [],
                        guests: parsed.state.guests || [],
                        bookings: parsed.state.bookings || []
                    };
                    console.log('CloudStore loaded from storage');
                } else if (parsed.guests && parsed.guests.length > 0) {
                    // Old format
                    this.data = parsed;
                    console.log('CloudStore loaded (legacy format)');
                } else {
                    await this.initializeDefaults();
                    await this.save();
                }
            } else {
                console.log('CloudStore: Initializing defaults...');
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
        } catch (e) {
            console.error('CloudStore save error:', e);
        }
    },
    
    // Generate UUID
    generateId() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
        
        // Properties
        this.data.properties = [
            {
                id: 'prop-1',
                name: 'CloudStay Hotel',
                type: 'hotel',
                address: '123 Main Street, City',
                rooms: 100
            }
        ];
        this.data.selectedPropertyId = 'prop-1';
        
        // Generate 100 Rooms
        const statuses = ['available', 'available', 'occupied', 'occupied', 'reserved', 'maintenance'];
        this.data.rooms = [];
        let roomId = 1;
        for (let floor = 1; floor <= 5; floor++) {
            for (let num = 1; num <= 20; num++) {
                const typeIdx = Math.floor(Math.random() * this.data.roomTypes.length);
                this.data.rooms.push({
                    id: String(roomId),
                    propertyId: 'prop-1',
                    name: `${floor}${num.toString().padStart(2, '0')}`,
                    type: this.data.roomTypes[typeIdx].id,
                    capacity: this.data.roomTypes[typeIdx].maxOccupancy,
                    rate: this.data.roomTypes[typeIdx].baseRate,
                    status: statuses[Math.floor(Math.random() * statuses.length)]
                });
                roomId++;
            }
        }
        
        // Sample Guests
        const names = [
            { firstName: 'James', lastName: 'Wilson' },
            { firstName: 'Maria', lastName: 'Garcia' },
            { firstName: 'John', lastName: 'Smith' },
            { firstName: 'Sarah', lastName: 'Johnson' },
            { firstName: 'Michael', lastName: 'Brown' },
            { firstName: 'Emma', lastName: 'Davis' },
            { firstName: 'Robert', lastName: 'Miller' },
            { firstName: 'Lisa', lastName: 'Anderson' }
        ];
        
        this.data.guests = names.map((name, i) => ({
            id: `guest-${i+1}`,
            name: `${name.firstName} ${name.lastName}`,
            email: `${name.firstName.toLowerCase()}@email.com`,
            phone: `+1 555 ${Math.floor(Math.random()*900)+100} ${Math.floor(Math.random()*9000)+1000}`,
            address: `${Math.floor(Math.random()*999)+1} ${['Oak', 'Maple', 'Pine', 'Cedar'][Math.floor(Math.random()*4)]} Street`
        }));
        
        // Generate Bookings
        const today = new Date();
        this.data.bookings = [];
        for (let i = 0; i < 30; i++) {
            const checkIn = new Date(today.getTime() + (Math.random()-0.4)*14*24*60*60*1000);
            const checkOut = new Date(checkIn.getTime() + (Math.floor(Math.random()*4)+1)*24*60*60*1000);
            const guest = this.data.guests[Math.floor(Math.random() * this.data.guests.length)];
            const room = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];
            const status = checkIn.toDateString() === today.toDateString() ? 'due_in' : 
                        checkOut.toDateString() === today.toDateString() ? 'due_out' : 'confirmed';
            
            this.data.bookings.push({
                id: `booking-${i+1}`,
                propertyId: 'prop-1',
                roomId: room.id,
                guestId: guest.id,
                guestName: guest.name,
                checkIn: checkIn.toISOString().split('T')[0],
                checkOut: checkOut.toISOString().split('T')[0],
                status: status,
                totalAmount: 99 + Math.floor(Math.random() * 200)
            });
        }
        
        // Housekeeping Tasks
        this.data.housekeeping = [];
        for (let i = 0; i < 15; i++) {
            const room = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];
            this.data.housekeeping.push({
                id: i + 1,
                roomId: room.id,
                roomName: room.name,
                type: ['cleaning', 'deep_clean', 'turnover', 'inspection'][Math.floor(Math.random() * 4)],
                assignedTo: ['Maria', 'Juan', 'Sofia', 'Carlos'][Math.floor(Math.random() * 4)],
                priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
                status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
                notes: '',
                createdAt: new Date().toISOString()
            });
        }
        
        // Settings
        this.data.settings = {
            hotelName: 'CloudStay Hotel',
            currency: 'USD',
            timezone: 'America/New_York',
            checkInTime: '15:00',
            checkOutTime: '11:00'
        };
    },
    
    // === PROPERTY OPERATIONS ===
    addProperty(property) {
        const newProp = { ...property, id: this.generateId() };
        this.data.properties.push(newProp);
        this.save();
        return newProp;
    },
    
    updateProperty(id, updates) {
        const idx = this.data.properties.findIndex(p => p.id === id);
        if (idx >= 0) {
            this.data.properties[idx] = { ...this.data.properties[idx], ...updates };
            this.save();
            return this.data.properties[idx];
        }
        return null;
    },
    
    deleteProperty(id) {
        this.data.properties = this.data.properties.filter(p => p.id !== id);
        this.save();
    },
    
    selectProperty(id) {
        this.data.selectedPropertyId = id;
        this.save();
    },
    
    // === ROOM OPERATIONS ===
    addRoom(room) {
        const newRoom = { ...room, id: this.generateId() };
        this.data.rooms.push(newRoom);
        this.save();
        return newRoom;
    },
    
    updateRoom(id, updates) {
        const idx = this.data.rooms.findIndex(r => r.id === id);
        if (idx >= 0) {
            this.data.rooms[idx] = { ...this.data.rooms[idx], ...updates };
            this.save();
            return this.data.rooms[idx];
        }
        return null;
    },
    
    deleteRoom(id) {
        this.data.rooms = this.data.rooms.filter(r => r.id !== id);
        this.save();
    },
    
    getAvailableRooms() {
        return this.data.rooms.filter(r => r.status === 'available');
    },
    
    getRoomById(id) {
        return this.data.rooms.find(r => r.id === id);
    },
    
    // === GUEST OPERATIONS ===
    addGuest(guest) {
        const newGuest = { ...guest, id: this.generateId() };
        this.data.guests.push(newGuest);
        this.save();
        return newGuest;
    },
    
    updateGuest(id, updates) {
        const idx = this.data.guests.findIndex(g => g.id === id);
        if (idx >= 0) {
            this.data.guests[idx] = { ...this.data.guests[idx], ...updates };
            this.save();
            return this.data.guests[idx];
        }
        return null;
    },
    
    deleteGuest(id) {
        this.data.guests = this.data.guests.filter(g => g.id !== id);
        this.save();
    },
    
    getGuestById(id) {
        return this.data.guests.find(g => g.id === id);
    },
    
    // === BOOKING OPERATIONS ===
    addBooking(booking) {
        const newBooking = { ...booking, id: this.generateId() };
        this.data.bookings.push(newBooking);
        this.save();
        return newBooking;
    },
    
    updateBooking(id, updates) {
        const idx = this.data.bookings.findIndex(b => b.id === id);
        if (idx >= 0) {
            const oldStatus = this.data.bookings[idx].status;
            this.data.bookings[idx] = { ...this.data.bookings[idx], ...updates };
            
            // Handle room status changes
            if (updates.status === 'checked-in' && oldStatus !== 'checked-in') {
                this.updateRoom(this.data.bookings[idx].roomId, { status: 'occupied' });
            } else if (updates.status === 'checked-out' && oldStatus !== 'checked-out') {
                this.updateRoom(this.data.bookings[idx].roomId, { status: 'available' });
            }
            
            this.save();
            return this.data.bookings[idx];
        }
        return null;
    },
    
    deleteBooking(id) {
        this.data.bookings = this.data.bookings.filter(b => b.id !== id);
        this.save();
    },
    
    getBookingById(id) {
        return this.data.bookings.find(b => b.id === id);
    },
    
    getBookingsByGuest(guestId) {
        return this.data.bookings.filter(b => b.guestId === guestId);
    },
    
    getBookingsByRoom(roomId) {
        return this.data.bookings.filter(b => b.roomId === roomId);
    },
    
    getActiveBookings() {
        const today = new Date().toISOString().split('T')[0];
        return this.data.bookings.filter(b => b.checkIn <= today && b.checkOut >= today);
    },
    
    getUpcomingCheckIns() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
        return this.data.bookings.filter(b => b.checkIn >= today && b.checkIn <= tomorrow);
    },
    
    getUpcomingCheckOuts() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
        return this.data.bookings.filter(b => b.checkOut >= today && b.checkOut <= tomorrow);
    },
    
    // === HOUSEKEEPING OPERATIONS ===
    addHousekeeping(task) {
        const newTask = { ...task, id: this.generateId(), status: 'pending' };
        this.data.housekeeping.push(newTask);
        this.save();
        return newTask;
    },
    
    updateHousekeeping(id, updates) {
        const idx = this.data.housekeeping.findIndex(h => h.id === id);
        if (idx >= 0) {
            this.data.housekeeping[idx] = { ...this.data.housekeeping[idx], ...updates };
            this.save();
            return this.data.housekeeping[idx];
        }
        return null;
    },
    
    // === SETTINGS OPERATIONS ===
    getSettings() {
        return { ...this.data.settings };
    },
    
    updateSettings(updates) {
        this.data.settings = { ...this.data.settings, ...updates };
        this.save();
        return this.data.settings;
    },
    
    // === STATISTICS ===
    getStats() {
        const today = new Date().toISOString().split('T')[0];
        const rooms = this.data.rooms;
        const bookings = this.data.bookings;
        
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(r => r.status === 'available').length;
        const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
        const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
        
        const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;
        
        const totalGuests = this.data.guests.length;
        const totalBookings = bookings.length;
        
        // Calculate revenue from checked-out bookings this month
        const thisMonth = new Date().getMonth();
        const monthlyRevenue = bookings
            .filter(b => new Date(b.checkOut).getMonth() === thisMonth)
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        
        return {
            totalRooms,
            availableRooms,
            occupiedRooms,
            maintenanceRooms,
            occupancyRate,
            totalGuests,
            totalBookings,
            monthlyRevenue
        };
    },
    
    // Clear all data
    clear() {
        this.data = {
            properties: [],
            selectedPropertyId: null,
            rooms: [],
            guests: [],
            bookings: [],
            roomTypes: [],
            activities: [],
            rates: [],
            housekeeping: [],
            folios: [],
            settings: {}
        };
        this.save();
    }
};

// Export for browser
window.CloudStore = CloudStore;
