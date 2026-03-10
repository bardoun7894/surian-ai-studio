<?php
// Add Central Administration directorate and sub-directorates

// Connect to the database
$host = 'postgres';
$dbname = 'surian_ai_studio';
$user = 'surian';
$password = 'surian_password';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if Central Administration already exists
    $stmt = $pdo->prepare("SELECT id FROM directorates WHERE id = 'd_central'");
    $stmt->execute();
    if ($stmt->fetch()) {
        echo "Central Administration already exists, updating...\n";
        $pdo->prepare("DELETE FROM sub_directorates WHERE parent_directorate_id = 'd_central'")->execute();
        $pdo->prepare("DELETE FROM directorates WHERE id = 'd_central'")->execute();
    }

    // Insert Central Administration directorate
    $stmt = $pdo->prepare("INSERT INTO directorates (id, name_ar, name_en, description, description_en, icon, is_active, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([
        'd_central',
        'الإدارة المركزية',
        'Central Administration',
        'المديريات المركزية التي تقدم الدعم الإداري والتنظيمي لكافة إدارات الوزارة.',
        'Central directorates providing administrative and organizational support to all ministry departments.',
        'Building2',
        true,
        true
    ]);
    echo "Central Administration directorate added.\n";

    // Insert Central Administration sub-directorates (from PDF red boxes)
    $centralSubs = [
        ['الرقابة الداخلية', 'Internal Oversight', '/directorates/central/oversight', false, 1],
        ['مديرية الشؤون القانونية', 'Legal Affairs Directorate', '/directorates/central/legal', false, 2],
        ['مديرية التخطيط والإحصاء', 'Planning and Statistics Directorate', '/directorates/central/planning', false, 3],
        ['مديرية الدعم التنفيذي', 'Executive Support Directorate', '/directorates/central/executive-support', false, 4],
        ['مديرية الشؤون المالية', 'Financial Affairs Directorate', '/directorates/central/finance', false, 5],
        ['مديرية التنمية الإدارية', 'Administrative Development Directorate', '/directorates/central/admin-dev', false, 6],
        ['مديرية المعلوماتية والتحول الرقمي', 'IT and Digital Transformation Directorate', '/directorates/central/it-digital', false, 7],
        ['مديرية الإمداد والتجهيز', 'Supply and Equipment Directorate', '/directorates/central/supply', false, 8],
    ];

    $stmt = $pdo->prepare("INSERT INTO sub_directorates (parent_directorate_id, name_ar, name_en, url, is_external, \"order\", is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, true, NOW(), NOW())");

    foreach ($centralSubs as $sub) {
        $stmt->execute(['d_central', $sub[0], $sub[1], $sub[2], $sub[3] ? 'true' : 'false', $sub[4]]);
    }

    echo "8 Central Administration sub-directorates added.\n";

    // Verify
    $count = $pdo->query("SELECT COUNT(*) FROM directorates WHERE featured = true")->fetchColumn();
    echo "Total featured directorates: $count\n";
    $subCount = $pdo->query("SELECT COUNT(*) FROM sub_directorates WHERE parent_directorate_id = 'd_central'")->fetchColumn();
    echo "Central admin sub-directorates: $subCount\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
