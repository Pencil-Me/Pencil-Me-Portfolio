<?php

require_once __DIR__ . '/bootstrap.php';

use Controller\Api\ProjectsController;
use Inc\Bootstrap;
use Model\CustomersModel;
use Model\DatesModel;
use Model\ProjectsModel;
use Model\TechstackModel;
use Inc\AppLogger;
use PHPUnit\Framework\TestCase;

class ProjectsControllerTest extends TestCase
{
    private const PROJECT_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    private const TECH_UUID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    private const CUSTOMER_UUID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

    protected function setUp(): void
    {
        require_once PROJECT_ROOT_PATH . 'Inc/Bootstrap.php';
        Bootstrap::$logger = new AppLogger(sys_get_temp_dir() . '/pm-projects-test.log', 'ERROR');
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $_SERVER['QUERY_STRING'] = '';
    }

    public function testGetAllFeUsesBatchEnrichment(): void
    {
        $projectsModel = $this->createMock(ProjectsModel::class);
        $techstackModel = $this->createMock(TechstackModel::class);
        $datesModel = $this->createMock(DatesModel::class);
        $customersModel = $this->createMock(CustomersModel::class);

        $projectsModel->expects($this->once())
            ->method('getProjects')
            ->with(100)
            ->willReturn([
                [
                    'uuid' => self::PROJECT_UUID,
                    'name' => 'Demo Project',
                    'location' => 'Berlin',
                    'position' => 'Dev',
                    'content' => 'Content',
                    'type' => 'Web',
                    'techstack_uuids' => self::TECH_UUID,
                    'customer_uuids' => self::CUSTOMER_UUID,
                ],
            ]);

        $techstackModel->expects($this->once())
            ->method('getTechstacksByUuids')
            ->with([self::TECH_UUID])
            ->willReturn([
                self::TECH_UUID => [
                    'uuid' => self::TECH_UUID,
                    'name' => 'PHP',
                    'type' => 'Backend',
                    'expertise_level' => 5,
                ],
            ]);

        $customersModel->expects($this->once())
            ->method('getCustomersByUuids')
            ->with([self::CUSTOMER_UUID])
            ->willReturn([
                self::CUSTOMER_UUID => [
                    'uuid' => self::CUSTOMER_UUID,
                    'name' => 'ACME',
                    'location' => 'Hamburg',
                ],
            ]);

        $datesModel->expects($this->once())
            ->method('getDatesGroupedByProject')
            ->with([self::PROJECT_UUID])
            ->willReturn([
                self::PROJECT_UUID => [
                    ['start_date' => '2024-01-01', 'end_date' => '2024-06-01'],
                ],
            ]);

        $techstackModel->expects($this->never())->method('getTechstacksPerProject');
        $customersModel->expects($this->never())->method('getCustomersPerProject');
        $datesModel->expects($this->never())->method('getDatesPerProject');

        $controller = new TestableProjectsController(
            $projectsModel,
            $techstackModel,
            $datesModel,
            $customersModel
        );

        $controller->getAllFe();

        $this->assertSame([
            [
                'uuid' => self::PROJECT_UUID,
                'name' => 'Demo Project',
                'location' => 'Berlin',
                'position' => 'Dev',
                'content' => 'Content',
                'tech' => [[
                    'uuid' => self::TECH_UUID,
                    'name' => 'PHP',
                    'type' => 'Backend',
                    'expertise_level' => 5,
                ]],
                'customers' => [[
                    'uuid' => self::CUSTOMER_UUID,
                    'name' => 'ACME',
                    'location' => 'Hamburg',
                ]],
                'dates' => [
                    ['start_date' => '2024-01-01', 'end_date' => '2024-06-01'],
                ],
                'type' => 'Web',
            ],
        ], $controller->lastResponse);
    }
}

final class TestableProjectsController extends ProjectsController
{
    public ?array $lastResponse = null;

    protected function sendSuccessResponse(array $data): void
    {
        $this->lastResponse = $data;
    }
}
