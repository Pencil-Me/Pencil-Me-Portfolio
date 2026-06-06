<?php

require_once __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;
use Controller\Api\ProjectsController;
use Model\ProjectsModel;

class ProjectsControllerTest extends TestCase
{
    private $projectsController;
    private $projectsModelMock;

    protected function setUp(): void
    {
        $this->projectsModelMock = $this->createMock(ProjectsModel::class);
        $this->projectsController = new ProjectsController();
    }

    public function testGetProjectFe()
    {
        $this->projectsModelMock->method('getProject')->willReturn([
            'uuid' => '1234',
            'name' => 'Test Project',
            // Weitere Felder...
        ]);

        $this->expectOutputString(json_encode([
            'uuid' => '1234',
            'name' => 'Test Project',
            // Weitere Felder...
        ]));

        $this->projectsController->getProjectFe(1);
    }

    // Weitere Tests für andere Methoden...
} 