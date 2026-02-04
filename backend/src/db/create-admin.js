const { UserService } = require('../services');

async function createAdmin() {
    try {
        const name = process.env.ADMIN_NAME || 'Default Admin';
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const nid = process.env.ADMIN_NID || 'ADMIN-NID-001';
        const areaId = Number(process.env.ADMIN_AREA_ID || 1);

        if (!email || !password) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
            process.exit(1);
        }

        await UserService.createUser({
            name,
            email,
            password,
            nid,
            area_id: areaId,
            role_id: 1,
            status: 'approved'
        });

        console.log('Admin user created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to create admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
