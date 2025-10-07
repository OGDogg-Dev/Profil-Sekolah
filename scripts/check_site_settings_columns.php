<?php
$db = __DIR__ . '/../database/database.sqlite';
if (! file_exists($db)) {
    echo "DB not found: $db\n";
    exit(1);
}

try {
    $pdo = new PDO('sqlite:' . $db);
} catch (Exception $e) {
    echo "PDO connect error: " . $e->getMessage() . "\n";
    exit(1);
}

$stmt = $pdo->query("PRAGMA table_info('site_settings')");
$cols = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : null;

if (! $cols) {
    echo "Table 'site_settings' not found or has no columns.\n";
    exit(0);
}

foreach ($cols as $c) {
    printf("%s\t%s\t%s\t%s\t%s\n", $c['cid'], $c['name'], $c['type'], $c['notnull'], $c['dflt_value']);
}
